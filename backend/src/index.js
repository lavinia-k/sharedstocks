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

// enhance your app security with Helmet
app.use(helmet());
// use bodyParser to parse application/json content-type
app.use(bodyParser.json());
// enable all CORS requests
app.use(cors());
// log HTTP requests
app.use(morgan("combined"));

// API Key to get stock price data
QUANDL_API_KEY = "Ojc1ODFmNGQxZWI0ZjgyY2I4MTZiYjI2MDJkNmEzYmY2";

// Databases
const accounts = [
  {
    id: 1,
    users: ["auth0|5c5fc6f9b06f034bf6a557b9"],
    wallet: 11050.6
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
        units: 75,
        totalPurchasePrice: 9000
      },
      {
        symbol: "GOOG",
        market: "NASDAQ",
        name: "Google",
        units: 12,
        totalPurchasePrice: 4562.75
      }
    ]
  }
];
const invitations = [
  {
    id: 1,
    invitationToken: "testing"
  }
];

// Check JWT Auth0 Token
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

// Get All Accounts for User
app.get("/users/:user/account", checkJwt, (req, res) => {
  const accounts = accounts.filter(account =>
    account.users.includes(req.params.user)
  );
  res.send(accounts);
});

// Get Wallet
app.get("/accounts/:id/wallet", (req, res) => {
  const account = accounts.find(account => account.id == req.params.id);
  res.send({ wallet: account.wallet });
});

// Update Wallet
app.post("/accounts/:id/wallet", (req, res) => {
  if (typeof req.body.wallet !== "number") {
    res.status(400).send();
  } else {
    const account = accounts.find(account => account.id == req.params.id);
    account.wallet = req.body.wallet;
    res.send({ wallet: account.wallet });
  }
});

// Helper Method: Get Shares for Account
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

// Helper Method: Get List of Securities/Tickers for Account
function getSecuritiesList(accountId) {
  const securities = getSharesForAccount(accountId).map(s => s.symbol);
  return securities;
}

// Get All Shares for Account
app.get("/accounts/:id/shares", (req, res) => {
  res.send(getSharesForAccount(req.params.id));
});

// Get Latest Share Prices for All Securities In An Account
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
        return res.status(500).send();
      }

      const securitiesWithLatestPrice = Object.assign(
        {},
        ...result.body.data.map(s => ({ [s.identifier]: s.value }))
      );

      res.send(securitiesWithLatestPrice);
    });
});

// Buy Shares
app.post("/buyshares", (req, res) => {
  const accountId = 1; // Test value

  const { symbol, units } = req.body;

  request
    .get("https://api.intrinio.com/data_point")
    .query({
      api_key: QUANDL_API_KEY,
      ticker: symbol,
      item: "last_price"
    })
    .then(result => {
      if (
        typeof result.body.value !== "number" ||
        isNaN(result.body.value) ||
        result.body.value == "na"
      ) {
        res.status(500).send();
      } else {
        const existingShare = shares
          .find(s => s.accountId == accountId)
          .shares.find(s => s.symbol === symbol);

        const cost = units * result.body.value;

        if (existingShare != undefined) {
          existingShare.units += units;
          existingShare.totalPurchasePrice += cost;
        } else {
          const newShare = {
            symbol: symbol,
            market: "NASDAQ",
            name: symbol,
            units: units,
            totalPurchasePrice: cost
          };
          shares.find(s => s.accountId == accountId).shares.push(newShare);
        }

        accounts[0].wallet = accounts[0].wallet - cost;
        res.status(200).send();
      }
    })
    .catch(error => {
      if (error) {
        console.log(error);
        res.status(500).send();
      }
    });
});

//Start server
app.listen(port, (req, res) => {
  console.log(`server listening on port: ${port}`);
});
