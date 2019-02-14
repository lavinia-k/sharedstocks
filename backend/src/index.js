//import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const request = require("superagent");

const app = express();
const port = process.env.PORT || 8081;

// API Key to get stock price data
QUANDL_API_KEY = "Ojc1ODFmNGQxZWI0ZjgyY2I4MTZiYjI2MDJkNmEzYmY2";

// Database
const questions = [];
const accounts = [
  {
    id: 1,
    users: ["auth0|5c5fc6f9b06f034bf6a557b9"],
    wallet: 1100.6
  }
];
const shares = [
  {
    accountId: 1,
    shares: [
      {
        symbol: "MSFT",
        market: "NASDAQ",
        name: "Microsoft",
        units: 5,
        totalPurchasePrice: 1000
      },
      {
        symbol: "GOOG",
        market: "NASDAQ",
        name: "Google",
        units: 75,
        totalPurchasePrice: 4562.75
      }
    ]
  }
];

// const wallet =

const invitations = [
  {
    id: 1,
    invitationToken: "testing"
  }
];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan("combined"));

// retrieve all questions
app.get("/", (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length
  }));
  res.send(qs);
});

// get a specific question
app.get("/:id", (req, res) => {
  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();
  res.send(question[0]);
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://sharedstocks.au.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: "7ccavZNopw5akETgf7BCQ8xGu2gW8bWR",
  issuer: `https://sharedstocks.au.auth0.com/`,
  algorithms: ["RS256"]
});

// retrieve all accounts for user
app.get("/users/:user/account", checkJwt, (req, res) => {
  const accounts = accounts.filter(account =>
    account.users.includes(req.params.user)
  );
  res.send(accounts);
});

function getSharesForAccount(accountId) {
  const accountShares = shares
    .find(s => s.accountId == accountId)
    .shares.map(s => ({
      symbol: s.symbol,
      market: s.market,
      name: s.name,
      units: s.units,
      totalPurchasePrice: s.totalPurchasePrice
    }));

  return accountShares;
}

function getSecuritiesList(accountId) {
  const securities = getSharesForAccount(accountId).map(s => s.symbol);
  return securities;
}

// retrieve all shares for account
app.get("/accounts/:id/shares", (req, res) => {
  res.send(getSharesForAccount(req.params.id));
});

// Get Quandl API Data
app.get("/accounts/:id/shares/latestprices", (req, res) => {
  ticker_array = getSecuritiesList(req.params.id);
  ticker_string = ticker_array.join(",");

  request
    .get("https://api.intrinio.com/data_point")
    .query({
      api_key: QUANDL_API_KEY,
      ticker: ticker_string,
      item: "last_price"
    })
    .end((error, result) => {
      if (error) {
        console.log(error);
      }

      const securitiesWithLatestPrice = Object.assign(
        {},
        ...result.body.data.map(s => ({ [s.identifier]: s.value }))
      );

      res.send(securitiesWithLatestPrice);
    });
});

// insert a new question
app.post("/buyshares", (req, res) => {
  const accountId = 1; // Test values
  const cost = 500; // Test values

  const { symbol, units } = req.body;
  const existingShare = shares
    .find(s => s.accountId == accountId)
    .shares.find(s => s.symbol === symbol);

  if (existingShare != undefined) {
    existingShare.units += units;
    existingShare.totalPurchasePrice += cost;
  } else {
    const newShare = {
      symbol: symbol,
      market: "NASDAQ",
      name: "Testing",
      units: units,
      totalPurchasePrice: cost
    };
    shares.find(s => s.accountId == accountId).shares.push(newShare);
  }
  res.status(200).send();
});

// insert a new question
app.post("/", checkJwt, (req, res) => {
  const { title, description } = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: [],
    author: req.user.name
  };
  questions.push(newQuestion);
  res.status(200).send();
});

// insert a new answer to a question
app.post("/answer/:id", checkJwt, (req, res) => {
  const { answer } = req.body;

  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();

  question[0].answers.push({
    answer,
    author: req.user.name
  });

  res.status(200).send();
});

//Start server
app.listen(port, (req, res) => {
  console.log(`server listening on port: ${port}`);
});
