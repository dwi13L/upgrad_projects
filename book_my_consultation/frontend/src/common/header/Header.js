import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import Modal from "react-modal";
import {
  Button,
  Tabs,
  Tab,
  CardHeader,
  CardContent,
  Card
} from "@material-ui/core";
import "./Header.css";
import TabContainer from "../tabContainer/TabContainer";
import Login from "../../screens/login/Login";
import Register from "../../screens/register/Register";

Modal.setAppElement(document.getElementById("root"));

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "0px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const Header = ({ baseUrl, isLoggedIn, setIsLoggedIn }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState(0);

  const toggleModalHandler = () => {
    setModalOpen(!modalOpen);
  };

  const tabSwitchHandler = (event, value) => {
    setValue(value);
  };

  const logoutHandler = async () => {
    const url = baseUrl + "auth/logout";
    const credentials = sessionStorage.getItem("accessToken");
    const init = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${credentials}`
      }
    };

    try {
      const rawResponse = await fetch(url, init);

      if (rawResponse.status !== 200) {
        throw new Error(`Something went wrong. Unable to log out.`);
      }

      sessionStorage.removeItem("user-details");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const login = async (email, password) => {
    const url = baseUrl + "auth/login";
    const credentials = window.btoa(email + ":" + password);
    const init = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Basic ${credentials}`
      }
    };

    try {
      const rawResponse = await fetch(url, init);

      if (rawResponse.status === 401) {
        throw new Error(
          "Invalid credentials entered.\nPlease check your input."
        );
      }

      if (rawResponse.status === 500) {
        console.log(
          `code: "GEN-001"`,
          `message: "query did not return a unique result`
        );
        throw new Error(
          "Sorry! This shoudldn't have happened.\nPlease contact customer support"
        );
      }

      if (rawResponse.status !== 200) {
        throw new Error("Something went wrong.\nUnable to login");
      }

      const response = await rawResponse.json();

      window.sessionStorage.setItem("user-details", JSON.stringify(response));
      window.sessionStorage.setItem("userId", JSON.stringify(response.id));
      window.sessionStorage.setItem("accessToken", response.accessToken);
      setIsLoggedIn(true);
      setTimeout(function () {
        toggleModalHandler();
      }, 1000);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <header className="header">
        <span>
          <img src={logo} className="logo" alt="logo" />
          <span className="title">Doctor Finder</span>
        </span>

        <div className="login-button">
          {/* Render based on login state */}
          {!isLoggedIn ? (
            <Button
              variant="contained"
              color="primary"
              onClick={toggleModalHandler}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          )}
        </div>
      </header>
      <Modal
        ariaHideApp={false}
        isOpen={modalOpen}
        onRequestClose={toggleModalHandler}
        style={customStyles}
      >
        <Card>
          <CardHeader className="cardHeader" title="Authentication" />
          <CardContent>
            <Tabs value={value} onChange={tabSwitchHandler}>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            <TabContainer>
              {/* Render based on tab value state */}
              {value === 0 && <Login login={login} isLoggedIn={isLoggedIn} />}
              {value === 1 && (
                <Register
                  baseUrl={baseUrl}
                  toggleModalHandler={toggleModalHandler}
                  login={login}
                />
              )}
            </TabContainer>
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
};

export default Header;
