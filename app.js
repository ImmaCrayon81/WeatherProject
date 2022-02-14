const express = require("express"); //makes node easier to use
const https = require("https"); //fetch external API
const app = express();
require('dotenv').config();
app.use(express.urlencoded({extended:true}));

console.log(process.env);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {

  const query = req.body.cityName
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;  //remember to add the https at the front

  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);

      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;

      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    })
  })
} )

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})

//test
