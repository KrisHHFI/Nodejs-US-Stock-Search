// Simple US stock ticker search program. Availability limited to Polygon.io coverage. Created by Kristopher Pepper, in 2022.
// User must input their own Polygon.io API key to the apiKey variable (free membership available).
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const apiKey = ''; // Add your personal api key.
let tickerList = [];

function displayTickerTable(tickerList) { // Prints ticker table to screen 
  console.table(tickerList, ['ticker', 'name', 'market_cap', 'total_employees', 'weighted_shares_outstanding']);
}

async function getRetrievedData(tickerInput) {// The API fetch and return
  let url = 'https://api.polygon.io/v3/reference/tickers/' + tickerInput + '?apiKey=' + apiKey;
  const response = await fetch(url);
  if ((!response.ok) || (response.statusText == 'Too Many Requests')) {
    var data = 'Fail';
    console.log('Fetch failed. Server response: ' + response.statusText + '.');
    return data;
  } else {
    var data = await response.json();
    data = data.results;
    if (data.name.length > 15) {
      data.name = data.name.slice(0, 15) + '...';
    }
    data.market_cap = Math.trunc(data.market_cap);
    return data;
  }
}

async function addToList(tickerInput) {
  let result = await getRetrievedData(tickerInput.toUpperCase());
  if (result == 'Fail') {
    USStockSearch();
  } else {
    tickerList.push((result));
    displayTickerTable(tickerList);
    USStockSearch();
  }
}

USStockSearch();
function USStockSearch() {
  readline.question('\nAdd ticker = a | Delete ticker = d | Exit = e : ', userPrompt => {
    if (userPrompt == 'a') {
      readline.question('\nEnter ticker characters: ', tickerInput => {
        if (tickerInput == '') {
          console.log('Input cannot be blank.');
          USStockSearch();
        } else {
          addToList(tickerInput);
        }
      });
    } else if (userPrompt == 'd') {
      readline.question('\nEnter ticker characters: ', tickerInput => {
        tickerList = tickerList.filter(ticker => ticker.ticker != tickerInput.toUpperCase());
        displayTickerTable(tickerList);
        USStockSearch();
      });
    } else if (userPrompt == 'e') {
      readline.close();
      return;
    }
    else {
      console.log('Incorrect value.');
      USStockSearch();
    }
  });
}