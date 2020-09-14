$("document").ready(function () {
  // global variables
  //   history list variables
  var historyArr = [];

  //   div and input variables
  var historyListDiv = $("#history-list");
  var mainCardDiv = $("#main-card-div");
  var forecastCardDiv = $("#forecast-card");
  var forecastHeaderDiv = $("#forecast-header");
  var input = $("input");

  //   main/current card variables
  var cardDeck = "";
  var location = "";
  var currentCity = "";
  var currentDate = "";
  var currentTemp = "";
  var currentHumidity = "";
  var currentWind = "";
  var currentUV = "";
  var currentIcon = "";

  //   latitude and longitude used to call location from forecast API (only takes coordinates)
  var latitude = "";
  var longitude = "";

  //   forecast card variables
  var forecastDate = "";
  var forecastTempHigh = "";
  var forecastTempLow = "";
  var forecastHumidity = "";
  var forecastIcon = "";

  // function call on page load
  checkLocalStorage();

  //  checks local storage for historical searches.
  // If local storage is not empty, pushes storage values to history array and renders history list.
  // also renders page based on last searched value stored
  function checkLocalStorage() {
    if (localStorage.getItem("History") != null) {
      var localStorageArr = localStorage.getItem("History").split(",");
      historyArr = localStorageArr;
      location = historyArr[historyArr.length - 1];
      getCurrentWeatherInfo();
      renderHistoryList();
    }
  }

  //   renders the history list based on the history array
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
      listGroup.prepend(listItem);
    }
    historyListDiv.append(listGroup);
  }

  // Renders the main card with current weather info.
  // Called by the getCurrentWeatherInfo function
  function renderMainCard() {
    //   create the main card
    var mainCard = $("<div>");
    mainCard.addClass("card mt-3 mb-5");
    // create the main card body
    var mainCardBody = $("<div>");
    mainCardBody.addClass("card-body");
    // create the main card title
    var mainCardTitle = $("<h2>");
    mainCardTitle.addClass("card-title");
    mainCardTitle.text(currentCity + " (" + currentDate + ")");
    // create current weather icon image
    var mainCardImg = $("<img>");
    mainCardImg.attr(
      "src",
      "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png"
    );
    // create the current temperature line
    var mainCardTemp = $("<h6>");
    mainCardTemp.addClass("card-subtitle mt-4");
    mainCardTemp.text("Temperature: " + currentTemp + "º F");
    // create the current humidity line
    var mainCardHumid = $("<h6>");
    mainCardHumid.addClass("card-subtitle mt-4");
    mainCardHumid.text("Humidity: " + currentHumidity + "%");
    // create the current wind line
    var mainCardWind = $("<h6>");
    mainCardWind.addClass("card-subtitle mt-4");
    mainCardWind.text("Wind Speed: " + currentWind + " mph");
    // create the UV line
    var mainCardUV = $("<h6>");
    mainCardUV.addClass("card-subtitle mt-4");
    mainCardUV.text("UV Index: ");
    // add a button to the UV line
    var btnUV = $("<a>");
    btnUV.attr("href", "https://www.epa.gov/sunsafety/uv-index-scale-0");
    btnUV.attr("target","_blank");
    btnUV.addClass("btn pr-4 pl-4 font-weight-bold");
    // colors the UV index button based on the UV index level
    if (currentUV < 3) {
      btnUV.addClass("uv-low");
    } else if (currentUV < 6) {
      btnUV.addClass("uv-moderate");
    } else if (currentUV < 8) {
      btnUV.addClass("uv-high");
    } else if (currentUV < 11) {
      btnUV.addClass("uv-very-high");
    } else {
      btnUV.addClass("uv-extreme");
    }
    btnUV.text(currentUV);
    mainCardUV.append(btnUV);
    // add all items to the card body
    mainCardBody.append(
      mainCardTitle,
      mainCardImg,
      mainCardTemp,
      mainCardHumid,
      mainCardWind,
      mainCardUV
    );
    // add the card body to the card
    mainCard.append(mainCardBody);
    // add the card to the div
    mainCardDiv.append(mainCard);
  }

  // creates the forecast header and initializes the card deck
  function startForecastDiv() {
    forecastHeaderDiv.append($("<h3>").text("5-Day Forecast"));
    cardDeck = $("<div>");
    cardDeck.addClass("card-deck");
  }

  // Renders the cards with current weather info.
  // Called by the getCurrentWeatherInfo function
  function renderForecastCards() {
    // creates daily card
    var forecastCard = $("<div>");
    forecastCard.addClass("card text-white bg-info");
    // creates daily card body
    var forecastCardBody = $("<div>");
    forecastCardBody.addClass("card-body");
    // creates daily card title
    var forecastCardTitle = $("<h5>");
    forecastCardTitle.addClass("card-title");
    forecastCardTitle.text(forecastDate);
    // creates daily card icon
    var forecastCardImg = $("<img>");
    forecastCardImg.addClass("card-img");
    forecastCardImg.attr(
      "src",
      "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
    );
    // creates daily card high temp line
    var forecastCardTempHigh = $("<p>");
    forecastCardTempHigh.addClass("card-text");
    forecastCardTempHigh.text("High: " + forecastTempHigh + "º F");
    // creates daily card low temp line
    var forecastCardTempLow = $("<p>");
    forecastCardTempLow.addClass("card-text");
    forecastCardTempLow.text("Low: " + forecastTempLow + "º F");
    // creates daily card humidity line
    var forecastCardHumid = $("<p>");
    forecastCardHumid.addClass("card-text");
    forecastCardHumid.text("Humidity: " + forecastHumidity + "%");
    // add all items to daily card body
    forecastCardBody.append(
      forecastCardTitle,
      forecastCardImg,
      forecastCardTempHigh,
      forecastCardTempLow,
      forecastCardHumid
    );
    // adds daily card body to daily card
    forecastCard.append(forecastCardBody);
    // adds daily card to the card deck
    cardDeck.append(forecastCard);
  }

  // First API Call for current weather info
  // Called when submit button is clicked or a city from the search history list is clicked
  function getCurrentWeatherInfo() {
    var currentQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      location.toLowerCase() +
      "&units=imperial&appid=da407777b164e6e32bbe74723dadca17";
    $.ajax({
      url: currentQueryURL,
      method: "GET",
    }).then(function (response) {
      /* mostly use this API for name and coordinates because second API call
      requires coordinates instead of a search and 
      this one does not have all the required current weather info */
      currentCity = response.name;
      latitude = response.coord.lat;
      longitude = response.coord.lon;
      // makes second API call
      getForecastInfo();
    });

    // Second API Call for forecasted weather info
    // Called by the getCurrentWeatherInfo function
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
        currentDate = moment.unix(response.daily[0].dt).format("l");
        currentTemp = Math.round(response.current.temp);
        currentHumidity = response.current.humidity;
        currentWind = response.current.wind_speed;
        currentUV = response.current.uvi;
        currentIcon = response.current.weather[0].icon;
        // uses above variables to render main card with current weather info
        renderMainCard();
        // begins the creation of the single use items in the forecast div
        startForecastDiv();
        // for loop to create one card for each of the 5 forecasted days
        // starts at location 1 because 0 is the forecast for the current day
        for (var dayIndex = 1; dayIndex < 6; dayIndex++) {
          forecastDate = moment.unix(response.daily[dayIndex].dt).format("l");
          forecastTempHigh = Math.round(response.daily[dayIndex].temp.max);
          forecastTempLow = Math.round(response.daily[dayIndex].temp.min);
          forecastHumidity = response.daily[dayIndex].humidity;
          forecastIcon = response.daily[dayIndex].weather[0].icon;
          // uses above variables to render each card with daily forecast info
          renderForecastCards();
        }
        // adds the card deck to the forecast div
        forecastCardDiv.append(cardDeck);
      });
    }
  }

  // listens for a click on the submit button
  $("#submit-btn").on("click", function (event) {
    event.preventDefault();
    // clears all the divs
    historyListDiv.empty();
    mainCardDiv.empty();
    forecastHeaderDiv.empty();
    forecastCardDiv.empty();
    // gets the input value and adds it to local storage
    location = input.val();
    historyArr.push(location);
    localStorage.setItem("History", historyArr);
    // calls the function to render info for the input value
    getCurrentWeatherInfo();
    // adds the input value to the history list
    renderHistoryList();
  });

  // listens for a click on a list item in the history list
  historyListDiv.on("click", ".list-group-item", function () {
    // clears all the card divs
    mainCardDiv.empty();
    forecastHeaderDiv.empty();
    forecastCardDiv.empty();
    // sets the location based on the list item clicked
    location = $(this).text();
    // calls the function to render info for the list item
    getCurrentWeatherInfo();
  });
});
