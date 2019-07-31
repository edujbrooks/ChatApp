var express = require("express");
var cors = require("cors");
var app = express();
var uuidv1 = require("uuid/v1");
var Message = require("./classes/Message.js");
app.use(cors());
const io = require("socket.io").listen(5001);

let users = [];

io.on("connection", client => {
  let yourId = uuidv1();
  let newAdminMessage = new Message(
    "0",
    "New anonymous user has connected to the server.",
    "Admin",
    null
  );

  //io.emit("userConnected", newAdminMessage);
  client.emit("yourId", yourId);

  //DISCONNECT
  client.on("disconnect", reason => {
    var filtered = users.filter(function(el) {
      return el.id != yourId;
    });
    users = filtered;

    let newAdminMessage = new Message(
      "0",
      "User disconnected. REASON: " + reason,
      "Admin",
      null
    );

    io.emit("userDisonnected", newAdminMessage);
    io.emit("updateUsers", users);
  });

  //UPDATE NAME
  client.on("addNameToId", (name, avatar, id) => {
    let updatedUser = new Object();
    updatedUser.name = name;
    updatedUser.id = id;
    updatedUser.avatar = avatar;
    users.push(updatedUser);
    io.emit("updateUsers", users);

    // send message of client joning the chat
    let newAdminMessage = new Message(
      "0",
      "User " + name + " has joined the chat.",
      "Admin",
      null
    );
    io.emit("userJoined", newAdminMessage);
  });

  //MESSAGE SENT
  client.on("messageSent", (message, userId) => {
    var filteredUser = users.filter(function(el) {
      return el.id === userId;
    });
    let newMessage = new Message(
      userId,
      message,
      filteredUser[0].name,
      filteredUser[0].avatar
    );
    io.emit("messageReceived", newMessage);
  });
});
