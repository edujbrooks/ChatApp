var uuidv1 = require("uuid/v1");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const internal = {};

function sanitizeMessage(message, userId) {
  /* TODO sanitize input */
  if (userId !== "0") {
    return message;
  } else {
    return message;
  }
}

/* enters a message like "I am ::happy" and returns "I am <img src='happy.gif'/> */
function giphyfy(message) {
  if (message.indexOf("::") !== -1) {
    var filteredValues = [];
    var values = message.split(" ");
    console.log("Values: ", values);
    values.forEach(function(element) {
      if (element.indexOf("::") == 0)
        filteredValues.push(element.replace("::", ""));
    });
    console.log("Filtered Values: ", filteredValues);

    filteredValues.forEach(function(element, i) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          //document.getElementById("demo").innerHTML = this.responseText;
          //console.log(JSON.parse(this.responseText.data));
          var dataReceived = JSON.parse(this.responseText);
          var dataReceived2 = dataReceived.data.images.original;
          var gifUrl = dataReceived2.url;
          console.log("WE ENTERED RESPONSE FROM GIFPHY!");
          console.log("image URL: ", gifUrl);
          imgTag = "<img src='" + gifUrl + "' alt='gif' />";
          console.log("message before insertion: ", message);
          console.log("filteredValues[i]: ", filteredValues[i]);
          message = message.replace("::" + filteredValues[i], imgTag);
          console.log("message after insertion: ", message);
        }
      };
      xhttp.open(
        "GET",
        "https://api.giphy.com/v1/gifs/translate?api_key=S0glSdF9ENtw611NIuzodD9exPLvEqa2&s=" +
          element,
        false
      );
      xhttp.send();
    });
    return message;
  } else {
    return message;
  }
}

module.exports = internal.Message = class {
  constructor(userId, messageBody, user, avatar) {
    var filteredMessageBody = sanitizeMessage(messageBody, userId);
    var gyphyfiedMessageBody = giphyfy(filteredMessageBody);
    //console.log('Initialize Class1 object’);
    this.messageId = uuidv1();
    this.userId = userId;
    this.messageBody = gyphyfiedMessageBody;
    this.user = user;
    this.avatar = avatar;
    this.date = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
};
