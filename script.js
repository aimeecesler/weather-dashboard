// add event listener for clicks on the submit button
// on submit, save the input to local storage (in an array?);
// on submit, run a function that renders the main card and content
// on submit, run a function that renders the 5 day forecast cards and content
// on submit, run a function that renders the city to the list along with other cities in local storage
// add event listener for a click on a list item, run functions to render main card and 5 day forecast
// add if statement that color codes the uv index

// global variables
var historyArr = ["Atlanta","New York"];

function renderHistoryList() {
  var listGroup = $("<ul>");
  listGroup.addClass("list-group");
  for (var historyIndex = 0; historyIndex < historyArr.length; historyIndex++) {
    var listItem = $("<li>");
    listItem.addClass("list-group-item");
    listItem.text(historyArr[historyIndex]);
    listGroup.append(listItem);
  }
  $("#history-list").append(listGroup);
}

function renderMainCard() {
  var mainCard = $("<div>");
  mainCard.addClass("card mt-3 mb-5");
  var mainCardBody = $("<div>");
  mainCardBody.addClass("card-body");
  var mainCardTitle = $("<h2>");
  mainCardTitle.addClass("card-title");
  mainCardTitle.text("City Name");
  var mainCardTemp = $("<h6>");
  mainCardTemp.addClass("card-subtitle mt-4");
  mainCardTemp.text("Temperature: ");
  var mainCardHumid = $("<h6>");
  mainCardHumid.addClass("card-subtitle mt-4");
  mainCardHumid.text("Humidity: ");
  var mainCardWind = $("<h6>");
  mainCardWind.addClass("card-subtitle mt-4");
  mainCardWind.text("Wind Speed: ");
  var mainCardUV = $("<h6>");
  mainCardUV.addClass("card-subtitle mt-4");
  mainCardUV.text("UV Index: ");
  mainCardBody.append(
    mainCardTitle,
    mainCardTemp,
    mainCardHumid,
    mainCardWind,
    mainCardUV
  );
  mainCard.append(mainCardBody);
  $("#main-card-div").append(mainCard);
}

function renderForecast() {
  $("#forecast-header").append($("<h3>").text("5-Day Forecast"));
  var cardDeck = $("<div>");
  cardDeck.addClass("card-deck");
  for (var i = 0; i < 5; i++) {
    var forecastCard = $("<div>");
    forecastCard.addClass("card text-white bg-info");
    var forecastCardBody = $("<div>");
    forecastCardBody.addClass("card-body");
    var forecastCardTitle = $("<h5>");
    forecastCardTitle.addClass("card-title");
    forecastCardTitle.text("Date " + i);
    var forecastCardImg = $("<img>");
    forecastCardImg.addClass("card-img");
    forecastCardImg.attr("src", "");
    var forecastCardTemp = $("<p>");
    forecastCardTemp.addClass("card-text");
    forecastCardTemp.text("Temperature: ");
    var forecastCardHumid = $("<p>");
    forecastCardHumid.addClass("card-text");
    forecastCardHumid.text("Humidity: ");
    forecastCardBody.append(
      forecastCardTitle,
      forecastCardImg,
      forecastCardTemp,
      forecastCardHumid
    );
    forecastCard.append(forecastCardBody);
    cardDeck.append(forecastCard);
  }
  $("#forecast-card").append(cardDeck);
}

$("#submit-btn").on("click", function (event) {
  event.preventDefault();
  historyArr.push($("input").val());
  renderMainCard();
  renderForecast();
  renderHistoryList();
  console.log(historyArr);
});
