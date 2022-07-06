import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import { Tab, Tabs } from "@material-ui/core";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";

const Home = ({ baseUrl }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    sessionStorage.getItem("accessToken") == null ? false : true
  );
  const [value, setValue] = useState(0);
  const [userAppointments, setUserAppointments] = useState([]);

  const tabSwitchHandler = (event, value) => {
    setValue(value);
  };

  const getUserAppointments = async () => {
    const emailId = JSON.parse(sessionStorage.getItem("userId"));
    const url = `${baseUrl}users/${emailId}/appointments`;
    const accessToken = sessionStorage.getItem("accessToken");
    const init = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json;Charset=UTF-8",
        Authorization: `Bearer ${accessToken}`
      }
    };

    try {
      const rawResponse = await fetch(url, init);

      if (rawResponse.status !== 200) {
        throw new Error("Unable to get appointments at the moment");
      }

      const response = await rawResponse.json();
      setUserAppointments(response);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserAppointments();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  return (
    <div>
      <Header
        baseUrl={baseUrl}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <Tabs
        variant="fullWidth"
        indicatorColor="primary"
        value={value}
        onChange={tabSwitchHandler}
      >
        <Tab label="Doctors"></Tab>
        <Tab label="Appointment"></Tab>
      </Tabs>
      {value === 0 && (
        <DoctorList
          getUserAppointments={getUserAppointments}
          userAppointments={userAppointments}
          baseUrl={baseUrl}
          isLoggedIn={isLoggedIn}
        />
      )}
      {value === 1 && (
        <Appointment
          userAppointments={userAppointments}
          baseUrl={baseUrl}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default Home;
