// add event listener for clicks on the submit button
// on submit, save the input to local storage (in an array?);
// on submit, run a function that renders the main card and content
// on submit, run a function that renders the 5 day forecast cards and content
// on submit, run a function that renders the city to the list along with other cities in local storage
// add event listener for a click on a list item, run functions to render main card and 5 day forecast
// add if statement that color codes the uv index

// global variables
var historyArr = [];

$("#submit-btn").on("click",function(event){
    event.preventDefault();
    historyArr.push($("input").val());
    console.log(historyArr);
});