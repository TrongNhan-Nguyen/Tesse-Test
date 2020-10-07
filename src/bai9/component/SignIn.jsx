import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { login } from "../../userSlice";
import "../styles/SignIn.css";

function SignIn(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const signIn = async () => {
    const user = {
      username,
      password,
    };
    try {
      let response = await fetch("http://localhost:5000/sign-in", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const statusCode = response.status;

      if (statusCode === 200) {
        const result = await response.json();
        dispatch(login(result));
        if (result.role === "admin") {
          return history.push("/admin");
        }
        return history.push("/user");
      }
      return history.push("/not-found");
    } catch (error) {
      console.log(error);
    }
  };
  const signUp = () => {
    history.push("/sign-up");
  };
  return (
    <div>
      <h1>Sign In</h1>
      <Form>
        <FormGroup>
          <Input
            name="username"
            placeholder="username"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormGroup>
        <Button
          onClick={signIn}
          style={{ marginRight: 10, backgroundColor: "blue" }}
        >
          Sign In
        </Button>
        <Button
          onClick={signUp}
          style={{ marginLeft: 10, backgroundColor: "blue" }}
        >
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

SignIn.propTypes = {};
export default SignIn;
