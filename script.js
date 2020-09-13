// add event listener for clicks on the submit button
// on submit, save the input to local storage (in an array?);
// on submit, run a function that renders the main card and content
// on submit, run a function that renders the 5 day forecast cards and content
// on submit, run a function that renders the city to the list along with other cities in local storage
// add event listener for a click on a list item, run functions to render main card and 5 day forecast
// add if statement that color codes the uv index

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
  function checkLocalStorage() {
    if (localStorage.getItem("History") != null) {
      var localStorageArr = localStorage.getItem("History").split(",");
      historyArr = localStorageArr;
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
      listGroup.append(listItem);
    }
    historyListDiv.append(listGroup);
  }

  // Renders the main card with current weather info.
  // Called when submit button is clicked or a city from the search history list is clicked
  function renderMainCard() {
    //   create the main card
    var mainCard = $("<div>");
    mainCard.addClass("card mt-3 mb-5");
    // create the main card bocy
    var mainCardBody = $("<div>");
    mainCardBody.addClass("card-body");
    // create the main card title
    var mainCardTitle = $("<h2>");
    mainCardTitle.addClass("card-title");
    mainCardTitle.text(currentCity + " (" + currentDate + ")");
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
    btnUV.addClass("btn pr-4 pl-4");
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
    forecastCardImg.attr(
      "src",
      "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
    );
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
    var currentQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      location.toLowerCase() +
      "&units=imperial&appid=da407777b164e6e32bbe74723dadca17";
    $.ajax({
      url: currentQueryURL,
      method: "GET",
    }).then(function (response) {
      currentCity = response.name;
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
        currentDate = moment.unix(response.daily[0].dt).format("l");
        currentTemp = parseInt(response.current.temp);
        currentHumidity = response.current.humidity;
        currentWind = response.current.wind_speed;
        currentUV = parseFloat(response.current.uvi);
        renderMainCard();
        forecastHeaderDiv.append($("<h3>").text("5-Day Forecast"));
        cardDeck = $("<div>");
        cardDeck.addClass("card-deck");
        currentUV = response.current.uvi;
        for (var dayIndex = 1; dayIndex < 6; dayIndex++) {
          forecastDate = moment.unix(response.daily[dayIndex].dt).format("l");
          forecastTempHigh = parseInt(response.daily[dayIndex].temp.max);
          forecastTempLow = parseInt(response.daily[dayIndex].temp.min);
          forecastHumidity = response.daily[dayIndex].humidity;
          forecastIcon = response.daily[dayIndex].weather[0].icon;
          renderForecastCards();
        }
        forecastCardDiv.append(cardDeck);
      });
    }
  }

  $("#submit-btn").on("click", function (event) {
    event.preventDefault();
    historyListDiv.empty();
    mainCardDiv.empty();
    forecastHeaderDiv.empty();
    forecastCardDiv.empty();
    location = input.val();
    historyArr.push(location);
    localStorage.setItem("History", historyArr);
    getCurrentWeatherInfo();
    renderHistoryList();
  });

  historyListDiv.on("click", ".list-group-item", function () {
    mainCardDiv.empty();
    forecastHeaderDiv.empty();
    forecastCardDiv.empty();
    location = $(this).text();
    getCurrentWeatherInfo();
  });
});
