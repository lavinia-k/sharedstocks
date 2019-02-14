// Instantiate wrapper around Alpha Vantage NPM package with API key
const keys = [
  "Y7FZNFUWEBO8T77U",
  "7Q70LWUN5B96OF5I",
  "64KCLWO37TF6Z9J2",
  "K9LU1Q2KNGPCVRTU",
  "KH6T8TNG91CQK1GF"
];

console.log("this page");

// const alphaVantageWrapper = require("alphavantage")({
//   key: "Y7FZNFUWEBO8T77U"
// });

const alphas = keys.map(key =>
  require("alphavantage")({
    key: key
  })
);

var iteration = 0;
function getAlpha() {
  console.log(iteration);
  // const alphaVantageWrapper = require("alphavantage")({
  //   key: keys[Math.floor(Math.random() * 6)]
  // });
  iteration += 1;
  return alphas[Math.floor(Math.random() * 6)];
}

// var Quandl = require("quandl");
// var quandl = new Quandl({
//   auth_token: "hvu7Ax_wrXUyqsu65NSG",
//   api_version: 3
//   // proxy: "http://myproxy:3128"
// });

export default getAlpha;
