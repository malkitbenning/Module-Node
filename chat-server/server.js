process.env.PORT = process.env.PORT || 9090;
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}...`);
});

app.get("/messages/:id", function (request, response) {
  const inputId = request.params.id;
  if (inputId) {
    const message = messages.filter((msg) => msg.id == inputId);
    if (message.length > 0) {
      response.json(message);
    } else {
      response.status(404).send("record not found");
    }
  }
});

app.get("/messages", function (request, response) {
  response.status(200).json(messages);
});

app.post("/messages", function (request, response) {
  let maxVal = Math.max(...messages.map((message) => message.id));
  let newRec = {};

  if (!request.body.from || !request.body.text) {
    response.status(400).send("data missing");
  } else {
    newRec.id = maxVal + 1;
    newRec.from = request.body.from;
    newRec.text = request.body.text;
    messages.push(newRec);
    response.status(200).send("record added");
  }
});

app.delete("/messages/:id", function (request, response) {
  let inMessageId = request.params.id;
  inMessageId = Number(inMessageId);
  let removeIndex = messages.map((message) => message.id).indexOf(inMessageId);
  if (removeIndex >= 0) {
    messages.splice(removeIndex, 1);
    response.status(200).send("deleted");
  } else {
    response.status(404).send("record not found");
  }
});