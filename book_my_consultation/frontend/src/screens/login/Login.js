import React, { useState } from "react";
import ErrorPopover from "../../common/ErrorPopover";

import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel
} from "@material-ui/core";

const StateValidity = {
  valid: `valid`,
  invalid: `invalid`
};

Object.freeze(StateValidity);

const Login = ({ login, isLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailClass, setEmailClass] = useState(StateValidity.valid);
  const [anchorEl, setAnchorEl] = useState(null);

  const setParentAnchorElNull = () => {
    setAnchorEl(null);
  };

  const changeEmailHandler = (event) => {
    setEmail(event.target.value);
    setEmailClass(StateValidity.valid);
  };

  const changePasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    //Data validation
    if (email === "") {
      setAnchorEl(e.currentTarget.children[0]);
      return;
    }
    if (password === "") {
      setAnchorEl(e.currentTarget.children[2]);
      return;
    }
    const validEmailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

    if (!email.match(validEmailPattern)) {
      setEmailClass(StateValidity.invalid);
      return;
    } else {
      setEmailClass(StateValidity.valid);
    }
    login(email, password);
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={loginHandler}>
        <FormControl required margin="dense">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            value={email}
            type="email"
            onChange={changeEmailHandler}
          />

          {email.length >= 1 && emailClass === StateValidity.invalid && (
            <FormHelperText className={emailClass}>
              <span style={{ color: "red" }}>Enter valid Email</span>
            </FormHelperText>
          )}
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <FormControl required margin="dense">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={changePasswordHandler}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>

        <br />
        <br />
        <br />

        {!isLoggedIn ? (
          <Button variant="contained" color="primary" type="submit">
            LOGIN
          </Button>
        ) : (
          <Button className="btn btn-success" variant="contained" type="submit">
            LOGGED IN
          </Button>
        )}
      </form>
    </div>
  );
};

export default Login;
