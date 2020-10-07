import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, FormGroup, Input } from "reactstrap";

function SignUp(props) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const history = useHistory();
  const signUp = async () => {
    try {
      const user = {
        fullName,
        username,
        password,
      };
      if (fullName.length <= 0 || username <= 0 || password <= 0) {
        return setMsg("All field is require, please fill up this form");
      }
      const response = await fetch("http://localhost:5000/sign-up", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const result = await response.status;
      if (result === 200) {
        return setMsg("Sign up successfully");
      } else {
        return setMsg(`username: ${username} is already exists`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const signIn = () => {
    history.push("/sign-in");
  };
  return (
    <div>
      <h1>Sign Up</h1>
      <Form>
        <FormGroup>
          <Input
            name="fullName"
            placeholder="Full name"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="email"
            placeholder="Username"
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
        {msg && <p style={{ color: "red" }}>{msg}</p>}
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


export default SignUp;
