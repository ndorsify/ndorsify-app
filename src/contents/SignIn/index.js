import { Button } from "../../components/button";
import { InputBox } from "../../components/inputTextbox";
import "./signIn.css";
import googleLogo from "../../assets/google-logo.png";
import fbLogo from "../../assets/fb-logo.jpg";
import twitterLogo from "../../assets/twitter-logo.png";

function SignIn() {
  return (
    <div>
      <div style={{ padding: "5px" }}>
        <InputBox placeHolder="Username" size="xlarge" color="#C4C4C4" />
      </div>
      <div style={{ padding: "5px" }}>
        <InputBox placeHolder="Password" size="xlarge" color="#C4C4C4" />
      </div>
      <div style={{ padding: "5px" }}>
        <Button color="#FF914D" primary size="xlarge" label="Sign In" />
      </div>
      <div>
        <p style={{ fontSize: "13px", color: "#FF914D" }}>Forgot Password?</p>
      </div>
      <div style={{ paddingTop: "5%" }}>
        <div style={{ padding: "5px" }}>
          <Button
            color="#FF5F5F"
            primary
            size="xlarge"
            label="Google"
            icon={googleLogo}
          />
        </div>
        <div style={{ padding: "5px" }}>
          <Button
            color="#2972FF"
            primary
            size="xlarge"
            label="Facebook"
            icon={fbLogo}
          />
        </div>
        <div style={{ padding: "5px" }}>
          <Button
            color="#26A6EE"
            primary
            size="xlarge"
            label="Twitter"
            icon={twitterLogo}
          />
        </div>
      </div>
    </div>
  );
}
export default SignIn;
