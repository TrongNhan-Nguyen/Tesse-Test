import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Card, CardText, Col, Container, Row } from "reactstrap";
import { setOpponent } from "../userSlice";

const baseURL = (userId, status) => {
  return `http://localhost:5000/user/${userId}?status=${status}`;
};
const RenderHistory = (props) => {
  const { itemHistory } = props;

  return (
    <Col xs="3" style={{ marginBottom: 10 }}>
      <Card body>
        <CardText>Duration: {itemHistory.duration}</CardText>
        <CardText>Result: {itemHistory.result}</CardText>
      </Card>
    </Col>
  );
};
function UserPage(props) {
  const user = useSelector((state) => state.user.user);
  const [msg, setMsg] = useState();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const signOut = async () => {
    try {
      const response = await fetch(baseURL(user._id, "offline"), {
        method: "POST",
      });
      const status = await response.status;
      if (status === 200) {
        history.push("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const findMatch = async () => {
    try {
      const response = await fetch(baseURL(user._id, "finding"), {
        method: "POST",
      });
      const status = await response.status;

      if (status === 201) {
        const result = await response.json();
        setMsg("");
        dispatch(setOpponent(result));
        return history.push("/game");
      }
      if (status === 202) {
        return setMsg("So no one is online now ");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getListHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/history/${user._id}`);
      const result = await response.json();
      setList(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getListHistory();
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <p style={{ color: "tomato", fontWeight: "bold" }}>
          Full name: {user && user.fullName}
        </p>
        <p style={{ color: "tomato", fontWeight: "bold" }}>
          Username: {user && user.username}
        </p>
        <Button onClick={findMatch} color="primary">
          Find match
        </Button>
        <Button onClick={signOut} color="primary">
          Sign out
        </Button>
      </div>
      {msg && <p style={{ color: "red", fontWeight: "bold" }}>{msg}</p>}
      <div>
        <h3>History</h3>
        <Container>
          <Row>
            {list.map((item, index) => (
              <RenderHistory key={index} itemHistory={item} />
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UserPage;
