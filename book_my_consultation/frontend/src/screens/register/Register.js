import React, { useState } from "react";
import ErrorPopover from "../../common/ErrorPopover";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button
} from "@material-ui/core";

const StateValidity = {
  valid: `valid`,
  invalid: `invalid`
};
Object.freeze(StateValidity);

const Register = ({ baseUrl, login }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [invalidEmailClass, setInvalidEmailClass] = useState(
    StateValidity.valid
  );
  const [invalidMobileClass, setInvalidMobileClass] = useState(
    StateValidity.valid
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const setParentAnchorElNull = () => {
    setAnchorEl(null);
  };

  const changeFirstNameHandler = (e) => {
    setFirstName(e.target.value);
  };
  const changeLastNameHandler = (e) => {
    setLastName(e.target.value);
  };
  const changeEmailHandler = (e) => {
    setEmail(e.target.value);
    setInvalidEmailClass(StateValidity.valid);
  };

  const changeRegistrationPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const changeMobileHandler = (e) => {
    setMobile(e.target.value);
    setInvalidMobileClass(StateValidity.valid);
  };

  const registerHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (firstName === "") {
      setAnchorEl(e.currentTarget.children[0]);
      return;
    }
    if (lastName === "") {
      setAnchorEl(e.currentTarget.children[3]);
      return;
    }
    if (email === "") {
      setAnchorEl(e.currentTarget.children[6]);
      return;
    }
    if (password === "") {
      setAnchorEl(e.currentTarget.children[9]);
      return;
    }
    if (mobile === "") {
      setAnchorEl(e.currentTarget.children[12]);
      return;
    }

    const validEmailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\\.,;:\s@"]{2,})$/i;

    const validMobilePattern = /^[6-9]\d{9}$/i;

    if (!email.match(validEmailPattern)) {
      setInvalidEmailClass(StateValidity.invalid);
      return;
    } else {
      setInvalidEmailClass(StateValidity.valid);
    }

    if (!mobile.match(validMobilePattern)) {
      setInvalidMobileClass(StateValidity.invalid);
      return;
    } else {
      setInvalidMobileClass(StateValidity.valid);
    }

    const requestBody = {
      emailId: email,
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      password: password
    };

    const url = baseUrl + "users/register";
    const init = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify(requestBody)
    };

    try {
      const rawResponse = await fetch(url, init);

      if (rawResponse.status !== 200) {
        throw new Error("Registration failed");
      }

      setIsRegistered(true);
      login(email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <form onSubmit={registerHandler} autoComplete="off" noValidate>
        <FormControl required>
          <InputLabel htmlFor="firstname">First Name</InputLabel>
          <Input
            type="text"
            id="firstname"
            onChange={changeFirstNameHandler}
            value={firstName}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        <FormControl required>
          <InputLabel htmlFor="lastname">Last Name</InputLabel>
          <Input
            type="text"
            id="lastname"
            onChange={changeLastNameHandler}
            value={lastName}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        <FormControl required>
          <InputLabel htmlFor="email">Email Id</InputLabel>
          <Input
            id="email"
            type="email"
            onChange={changeEmailHandler}
            value={email}
          />
          {email.length >= 1 && invalidEmailClass === StateValidity.invalid && (
            <FormHelperText className={invalidEmailClass}>
              <span className="red">Enter valid Email</span>
            </FormHelperText>
          )}
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        <FormControl required>
          <InputLabel htmlFor="registrationPassword">Password</InputLabel>
          <Input
            type="password"
            id="registrationPassword"
            onChange={changeRegistrationPasswordHandler}
            value={password}
          />
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />

        <FormControl required>
          <InputLabel htmlFor="mobile">Mobile No.</InputLabel>
          <Input id="mobile" onChange={changeMobileHandler} value={mobile} />
          {mobile.length >= 1 && invalidMobileClass === StateValidity.invalid && (
            <FormHelperText className={invalidMobileClass}>
              <span className="red">Enter valid mobile number</span>
            </FormHelperText>
          )}
          <ErrorPopover
            anchor={anchorEl}
            setParentAnchorElNull={setParentAnchorElNull}
          />
        </FormControl>
        <br />
        <br />
        {isRegistered === true && (
          <FormControl>
            <span>Registration Successful.</span>
          </FormControl>
        )}

        <br />

        {!isRegistered ? (
          <Button variant="contained" color="primary" type="submit">
            REGISTER
          </Button>
        ) : (
          <Button className="btn btn-success" variant="contained" type="submit">
            REGISTERED
          </Button>
        )}
      </form>
    </div>
  );
};

export default Register;
