import React, { useState } from "react";
import { Rating } from "@material-ui/lab";
import {
  Paper,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  Button,
  FormHelperText,
  Typography
} from "@material-ui/core";

const StateValidity = {
  valid: "valid",
  invalid: "invalid"
};

Object.freeze(StateValidity);

const RateAppointment = ({ appointment, baseUrl, toggleModalHandler }) => {
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingRequiredClass, setRatingRequiredClass] = useState(
    StateValidity.valid
  );
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const ratingChangeHanler = (event, newValue) => {
    setRating(newValue);
    setRatingRequiredClass(StateValidity.valid);
  };

  const submitRatingHandler = async () => {
    if (
      rating === 0 ||
      rating === null ||
      ratingRequiredClass === StateValidity.invalid
    ) {
      setRatingRequiredClass(StateValidity.invalid);
      return;
    } else {
      setRatingRequiredClass(StateValidity.valid);
    }

    const accessToken = sessionStorage.getItem("accessToken");

    const url = baseUrl + "ratings";

    let requestBody = {
      appointmentId: appointment.appointmentId,
      doctorId: appointment.doctorId,
      rating: rating,
      comments: comments
    };

    const init = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    };

    try {
      const rawResponse = await fetch(url, init);

      if (rawResponse.status === 400) {
        throw new Error("Bad Post Request");
      }

      if (rawResponse.status !== 200) {
        throw new Error("Unable to post rating");
      }

      setRatingSubmitted(true);
      setTimeout(function () {
        toggleModalHandler();
      }, 1000);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Paper className="card">
      <CardHeader className="cardHeader" title="Rate an Appointment" />
      <CardContent key={appointment.appointmentId}>
        <div>
          <FormControl>
            <TextField
              id="standard-multiline-static"
              label="Comments"
              multiline
              minRows={4}
              defaultValue=""
              onChange={(e) => setComments(e.target.value)}
            />
          </FormControl>
        </div>
        <br />
        <div>
          <FormControl>
            <div>
              <Typography
                variant="body1"
                component="span"
                className="hasTextBlack"
              >
                Rating:
              </Typography>

              <Rating
                name={appointment.appointmentId}
                value={rating}
                onChange={ratingChangeHanler}
              />
            </div>
            {ratingRequiredClass === StateValidity.invalid && (
              <FormHelperText className={ratingRequiredClass}>
                <span className="red">Select a rating</span>
              </FormHelperText>
            )}
          </FormControl>
        </div>
        <br />
        {ratingSubmitted === true && (
          <FormControl>
            <span>Rating submitted successfully.</span>
          </FormControl>
        )}
        <br />
        <br />
        <div>
          {!ratingSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={submitRatingHandler}
            >
              RATE APPOINTMENT
            </Button>
          ) : (
            <Button
              className="btn btn-success"
              variant="contained"
              onClick={submitRatingHandler}
            >
              SUCCESS
            </Button>
          )}
        </div>
      </CardContent>
    </Paper>
  );
};

export default RateAppointment;
