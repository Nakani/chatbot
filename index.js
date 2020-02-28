"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  var speech =
    req.body.result && req.body.result.parameters
      ? req.body.result.fulfillment.messages.speech
      : "Desculpa eu não entendi, pode repetir?";

  return res.json({
    speech: speech,
    displayText: speech,
    source: "chatbot service pascal"
  });
});

restService.post("/audio", function(req, res) {
  var speech = "";
  switch (req.body.result.parameters.oquebff.toLowerCase()) {
    //Speech Synthesis Markup Language
    case "musica um":
      speech = "foi pedido musica um";
      break;
    case "musica dois":
      speech = "foi pedido musica dois";
      break;
    case "musica tres":
      speech = "foi pedido musica tres";
      break;
    case "bff":
      speech = "Exemplo de uso com o bff";
      break;
  }
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
