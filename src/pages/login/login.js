import React from "react";
import "./login.css";
import { Button } from "../../components/button";
import logo from "../../assets/siteLogo.png";
import SignIn from "../../contents/SignIn";
import SignUp from "../../contents/SignUp";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: true,
    };
  }
  handleOnClickSignIn = () => {
    this.setState({
      isSignIn: true,
    });
  };
  handleOnClickSignUp = () => {
    this.setState({
      isSignIn: false,
    });
  };
  render() {
    return (
      <div className="login-Outer-Wrapper">
        <div style={{ paddingBottom: "1%" }}>
          <div style={{ float: "left", width: "5%" }}>
            <img
              src={logo}
              alt="Welcome to Ndorsify"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ float: "right" }}>
            <Button
              color="#FF914D"
              primary={false}
              size="xlarge"
              label="Join as a Brand"
            />
          </div>
        </div>
        <div className="login-Inner-Wrapper">
          <div style={{ paddingBottom: "3%" }}>
            <span style={{ padding: "2%" }}>
              <Button
                color="#FF914D"
                primary={this.state.isSignIn}
                size="large"
                label="SIGN IN"
                onClick={this.handleOnClickSignIn}
              />
            </span>
            <span style={{ padding: "2%" }}>
              <Button
                color="#FF914D"
                primary={!this.state.isSignIn}
                size="large"
                label="SIGN UP"
                onClick={this.handleOnClickSignUp}
              />
            </span>
          </div>
          {this.state.isSignIn ? <SignIn /> : <SignUp />}
        </div>
      </div>
    );
  }
}
export default Login;
