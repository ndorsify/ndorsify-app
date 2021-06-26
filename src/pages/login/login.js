import React from "react";
import "./login.css";
import { Button } from "../../components/button";
import { InputBox } from "../../components/inputTextbox";

class Login extends React.Component {
  render() {
    return (
      <div className="login-Outer-Wrapper">
        <div style={{ paddingBottom: "1%" }}>
          <div style={{ float: "left" }}>Logo</div>
          <div style={{ float: "right" }}>
            <Button color="red" secondary size="xlarge" label="Sign Up" />
          </div>
        </div>
        <div className="login-Inner-Wrapper">
          <div style={{ padding: "5px" }}>
            <InputBox placeHolder="Enter username" size="xlarge" />
          </div>
          <div style={{ padding: "5px" }}>
            <InputBox placeHolder="Enter password" size="xlarge" />
          </div>
          <div style={{ padding: "5px" }}>
            <Button color="red" primary size="xlarge" label="Sign In" />
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
