const express = require("express");
const cors = require("cors");

const app = express();
const moment = require("moment");
const isemail = require("isemail");
app.use(express.json());
app.use(cors());
const port = 3000;

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings/search/", function (request, response) {
  if (request.query.date) {
    let checkDate = request.query.date;
    let matchedBookings = bookings.filter((aBooking) => {
      return moment(checkDate).isBetween(aBooking.checkInDate, aBooking.checkOutDate);
    });
    response.send(matchedBookings);
  }
  if (request.query.term) {
    let searchTerm = request.query.term;
    let matchedBookings = bookings.filter((aBooking) => {
      let answer = false;
      if (aBooking.email.toUpperCase().includes(searchTerm.toUpperCase())) answer = true;
      if (aBooking.firstName.toUpperCase().includes(searchTerm.toUpperCase())) answer = true;
      if (aBooking.surname.toUpperCase().includes(searchTerm.toUpperCase())) answer = true;
      return answer;
    });
    response.send(matchedBookings);
  }
  
});

app.get("/bookings/:id", function (request, response) {
  let checkId = Number(request.params.id);
  let aBooking = bookings.find((booking) => {
    return booking.id === checkId;
  });
  if (aBooking) response.json(aBooking);
  else response.status(404).send("cannot find booking");
});

app.post("/bookings", function (request, response) {
  let maxVal = Math.max(...bookings.map((booking) => booking.id));
  let newBooking = {};

  if (!request.body.title || !request.body.firstName || !request.body.surname || !request.body.email || !request.body.roomId || !request.body.checkInDate || !request.body.checkOutDate) {
    response.status(400).send("data missing");
  } else if (moment(request.body.checkOutDate).isBefore(request.body.checkInDate)) {
    response.status(400).send("check out date must be after check in date");
  } else if (!isemail.validate(request.body.email)) {
    response.status(400).send("invalid email address");
  } else {
    newBooking.id = maxVal + 1;
    newBooking.title = request.body.title;
    newBooking.firstName = request.body.firstName;
    newBooking.surname = request.body.surname;
    newBooking.email = request.body.email;
    newBooking.roomId = Number(request.body.roomId);
    newBooking.checkInDate = request.body.checkInDate;
    newBooking.checkOutDate = request.body.checkOutDate;
    bookings.push(newBooking);
    response.status(200).send("record added");
  }
});

app.delete("/bookings/:id", function (request, response) {
  let checkId = Number(request.params.id);
  let position = bookings.findIndex((booking) => {
    return booking.id === checkId;
  });
  if (position === -1) {
    response.status(404).send("cannot find booking");
  } else {
    bookings.splice(position, 1);
    response.json(bookings);
  }
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// TODO add your routes and helper functions here

const listener = app.listen(port, function () {
  // console.log("Your app is listening on port " + listener.address().port);
  console.log("Your app is listening on port " + port);
});
