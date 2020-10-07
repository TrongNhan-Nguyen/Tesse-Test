import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardText, Col, Container, Row } from "reactstrap";

const RenderUser = (props) => {
  const { user, deleteUser } = props;

  const handleDeleteUser = () => {
    if (deleteUser) {
      deleteUser(user);
    }
  };
  return (
    <Col xs="3" style={{ marginBottom: 10 }}>
      <Card body>
        <CardText>Full Name: {user.fullName}</CardText>
        <CardText>Username: {user.username}</CardText>
        <Button onClick={handleDeleteUser} color="danger">
          Delete User
        </Button>
      </Card>
    </Col>
  );
};

function AdminPage(props) {
  const [list, setList] = useState([]);
  const history = useHistory();
  const deleteUser = async (user) => {
    try {
      const index = list.findIndex((x) => x._id === user._id);
      if (index >= 0) {
        const response = await fetch(
          `http://localhost:5000/user/${list[index]._id}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.status;
        if (result === 200) {
          const tempList = [...list];
          tempList.splice(index, 1);
          setList(tempList);
          console.log("deleted");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getList = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const result = await response.json();
      setList(result);
    } catch (error) {
      console.log(error);
    }
  };
  const signOut = () => {
    history.push("/sign-in");
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <h3>Admin Page</h3>{" "}
        <Button onClick={signOut} color="primary" style={{ marginLeft: 10 }}>
          Sign out
        </Button>
      </div>
      <Container>
        <Row>
          {list.map((user, index) => (
            <RenderUser key={index} user={user} deleteUser={deleteUser} />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default AdminPage;
