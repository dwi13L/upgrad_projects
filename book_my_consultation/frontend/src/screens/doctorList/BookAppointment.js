import React, { useState, useEffect } from "react";
import {
  Paper,
  CardHeader,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText
} from "@material-ui/core";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

const StateValidity = {
  selected: `selected`,
  unselected: `unselected`
};
Object.freeze(StateValidity);

const BookAppointment = (props) => {
  const {
    baseUrl,
    doctor,
    getUserAppointments,
    userAppointments,
    closeModalHandler,
    isLoggedIn
  } = props;

  const dateFormatter = (date) => {
    const dateArray = date.toLocaleDateString().split("/");
    const newDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    return newDate;
  };

  let doctorName = `${doctor.firstName} ${doctor.lastName}`;

  const currentUserAppoinments = userAppointments;
  const [selectedDate, setSelectedDate] = useState(dateFormatter(new Date()));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState(["None"]);
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookedSuccessfully, setBookedSuccessfully] = useState(false);
  const [slotRequiredClass, setSlotRequiredClass] = useState(
    StateValidity.selected
  );

  const handleDateChange = (date) => {
    setSelectedDate(dateFormatter(date));
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
    setSlotRequiredClass(StateValidity.selected);
  };

  const getAvailableSlots = async () => {
    const url = `${baseUrl}doctors/${doctor.id}/timeSlots?date=${selectedDate}`;

    try {
      const rawResponse = await fetch(url);

      if (rawResponse.status !== 200) {
        throw new Error("Couldn't get available slots for the day");
      }

      const response = await rawResponse.json();
      setAvailableSlots(response.timeSlot);
    } catch (e) {
      alert(e.message);
    }
  };

  const bookAppointmentHandler = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please Login to Book an appointment");
      closeModalHandler();
      return;
    }

    if (
      selectedSlot === "None" ||
      selectedSlot === null ||
      selectedSlot === ""
    ) {
      setSlotRequiredClass(StateValidity.unselected);
      return;
    }

    const emailId = JSON.parse(sessionStorage.getItem("userId"));
    const userDetails = JSON.parse(sessionStorage.getItem("user-details"));
    const accessToken = sessionStorage.getItem("accessToken");

    const existingBooking = currentUserAppoinments.filter((appointment) => {
      if (
        appointment.appointmentDate === selectedDate &&
        appointment.timeSlot === selectedSlot
      ) {
        return appointment;
      }
      return null;
    });

    if (existingBooking.length > 0) {
      alert("Either the slot is already booked or not available");
      return;
    }

    let requestBody = {
      doctorId: doctor.id,
      doctorName: doctorName,
      userId: emailId,
      userName: `${userDetails.firstName} ${userDetails.lastName}`,
      timeSlot: selectedSlot,
      createdDate: dateFormatter(new Date()),
      appointmentDate: selectedDate,
      symptoms: symptoms,
      priorMedicalHistory: medicalHistory
    };

    const url = baseUrl + "appointments";
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

      if (rawResponse.status !== 200) {
        throw new Error("Unable to create booking. Please try later");
      }

      setBookedSuccessfully(true);
      getUserAppointments();
      setTimeout(function () {
        closeModalHandler();
      }, 1000);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    getAvailableSlots();
    // eslint-disable-next-line
  }, [selectedDate]);

  return (
    <div>
      <Paper className="bookingModal">
        <CardHeader className="cardHeader" title="Book an Appointment" />
        <CardContent key={doctor.id}>
          <form noValidate autoComplete="off" onSubmit={bookAppointmentHandler}>
            <div>
              <TextField
                disabled
                id="standard-disabled"
                label="DoctorName"
                required
                value={doctorName}
              />
            </div>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div>
              <FormControl>
                <InputLabel id="timeSlotInput">Time Slot</InputLabel>
                <Select
                  labelId="timeSlotInput"
                  id="timeSlotInput"
                  value={selectedSlot}
                  onChange={handleSlotChange}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {availableSlots.map((slot, key) => (
                    <MenuItem key={key} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
                {slotRequiredClass === StateValidity.unselected && (
                  <FormHelperText className={slotRequiredClass}>
                    <span className="red">Select a time slot</span>
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <br />
            <div>
              <FormControl>
                <TextField
                  id="standard-multiline-static"
                  label="Medical History"
                  multiline
                  minRows={4}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </FormControl>
            </div>
            <br />
            <div>
              <FormControl>
                <TextField
                  id="standard-multiline-static"
                  label="Symptoms"
                  multiline
                  minRows={4}
                  value={symptoms}
                  placeholder="ex.Cold, Swelling, etc"
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </FormControl>
            </div>
            <br />
            {bookedSuccessfully === true && (
              <FormControl>
                <span>Appointment booked successfully.</span>
              </FormControl>
            )}
            <br />
            <br />
            {!bookedSuccessfully ? (
              <Button
                id="bookappointment"
                type="submit"
                variant="contained"
                color="primary"
              >
                BOOK APPOINTMENT
              </Button>
            ) : (
              <Button
                className="btn btn-success"
                id="bookappointment"
                type="submit"
                variant="contained"
              >
                BOOKED
              </Button>
            )}
          </form>
        </CardContent>
      </Paper>
    </div>
  );
};

export default BookAppointment;
