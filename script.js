// add event listener for clicks on the submit button
// on submit, save the input to local storage (in an array?);
// on submit, run a function that renders the main card and content
// on submit, run a function that renders the 5 day forecast cards and content
// on submit, run a function that renders the city to the list along with other cities in local storage
// add event listener for a click on a list item, run functions to render main card and 5 day forecast
// add if statement that color codes the uv index

$("document").ready(function () {
  // global variables
  var historyArr = ["Atlanta", "New York"];
  var historyListDiv = $("#history-list");
  var mainCardDiv = $("#main-card-div");
  var forecastCardDiv = $("#forecast-card");
  var forecastHeaderDiv = $("#forecast-header");
  var input = $("input");
  var currentCity = "";
  var currentDate = "";
  var currentTemp = "";
  var currentHumidity = "";
  var currentWind = "";
  var currentUV = "";
  var latitude = "";
  var longitude = "";
  var forecastDate = "";
  var cardDeck = "";
  var forecastTempHigh = "";
  var forecastTempLow = "";
  var forecastHumidity = "";
  var forecastIcon = "";

  function renderHistoryList() {
    var listGroup = $("<ul>");
    listGroup.addClass("list-group");
    for (
      var historyIndex = 0;
      historyIndex < historyArr.length;
      historyIndex++
    ) {
      var listItem = $("<li>");
      listItem.addClass("list-group-item");
      listItem.text(historyArr[historyIndex]);
      listGroup.append(listItem);
    }
    historyListDiv.append(listGroup);
  }

  function renderMainCard() {
    var mainCard = $("<div>");
    mainCard.addClass("card mt-3 mb-5");
    var mainCardBody = $("<div>");
    mainCardBody.addClass("card-body");
    var mainCardTitle = $("<h2>");
    mainCardTitle.addClass("card-title");
    mainCardTitle.text(currentCity + " (" + currentDate + ")");
    var mainCardTemp = $("<h6>");
    mainCardTemp.addClass("card-subtitle mt-4");
    mainCardTemp.text("Temperature: " + currentTemp + "º F");
    var mainCardHumid = $("<h6>");
    mainCardHumid.addClass("card-subtitle mt-4");
    mainCardHumid.text("Humidity: " + currentHumidity + "%");
    var mainCardWind = $("<h6>");
    mainCardWind.addClass("card-subtitle mt-4");
    mainCardWind.text("Wind Speed: " + currentWind + " mph");
    var mainCardUV = $("<h6>");
    mainCardUV.addClass("card-subtitle mt-4");
    mainCardUV.text("UV Index: " + currentUV);
    mainCardBody.append(
      mainCardTitle,
      mainCardTemp,
      mainCardHumid,
      mainCardWind,
      mainCardUV
    );
    mainCard.append(mainCardBody);
    mainCardDiv.append(mainCard);
  }

  function renderForecastCards() {
    var forecastCard = $("<div>");
    forecastCard.addClass("card text-white bg-info");
    var forecastCardBody = $("<div>");
    forecastCardBody.addClass("card-body");
    var forecastCardTitle = $("<h5>");
    forecastCardTitle.addClass("card-title");
    forecastCardTitle.text(forecastDate);
    var forecastCardImg = $("<img>");
    forecastCardImg.addClass("card-img");
    forecastCardImg.attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
    var forecastCardTempHigh = $("<p>");
    forecastCardTempHigh.addClass("card-text");
    forecastCardTempHigh.text("High: " + forecastTempHigh + "º F");
    var forecastCardTempLow = $("<p>");
    forecastCardTempLow.addClass("card-text");
    forecastCardTempLow.text("Low: " + forecastTempLow + "º F");
    var forecastCardHumid = $("<p>");
    forecastCardHumid.addClass("card-text");
    forecastCardHumid.text("Humidity: " + forecastHumidity + "%");
    forecastCardBody.append(
      forecastCardTitle,
      forecastCardImg,
      forecastCardTempHigh,
      forecastCardTempLow,
      forecastCardHumid
    );
    forecastCard.append(forecastCardBody);
    cardDeck.append(forecastCard);
  }

  function getCurrentWeatherInfo() {
    var location = input.val();
    var currentQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      location.toLowerCase() +
      "&units=imperial&appid=da407777b164e6e32bbe74723dadca17";
    $.ajax({
      url: currentQueryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      currentCity = response.name;
      currentDate = moment.unix(response.dt).format("l");
      latitude = response.coord.lat;
      longitude = response.coord.lon;
      getForecastInfo();
    });
    function getForecastInfo() {
      var forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=imperial&appid=da407777b164e6e32bbe74723dadca17";
      $.ajax({
        url: forecastQueryURL,
        method: "GET",
      }).then(function (response) {
        currentTemp = parseInt(response.current.temp);
        currentHumidity = response.current.humidity;
        currentWind = response.current.wind_speed;
        currentUV = response.current.uvi;
        renderMainCard();
        forecastHeaderDiv.append($("<h3>").text("5-Day Forecast"));
        cardDeck = $("<div>");
        cardDeck.addClass("card-deck");
        currentUV = response.current.uvi;
        for (var dayIndex = 0; dayIndex < 5; dayIndex++) {
          forecastDate = moment.unix(response.daily[dayIndex].dt).format("l");
          forecastTempHigh = parseInt(response.daily[dayIndex].temp.max);
          forecastTempLow = parseInt(response.daily[dayIndex].temp.min);
          forecastHumidity = response.daily[dayIndex].humidity;
          forecastIcon = response.daily[dayIndex].weather[0].icon;
          renderForecastCards();
        }
        forecastCardDiv.append(cardDeck);
        console.log(response);
      });
    }
  }

  $("#submit-btn").on("click", function (event) {
    event.preventDefault();
    historyListDiv.empty();
    mainCardDiv.empty();
    forecastHeaderDiv.empty();
    forecastCardDiv.empty();
    historyArr.push(input.val());
    localStorage.setItem("History", historyArr);
    getCurrentWeatherInfo();
    renderHistoryList();
    console.log(historyArr);
  });
});
