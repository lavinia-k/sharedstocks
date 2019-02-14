import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading";
import SharesCard from "./SharesCard";
import formatMoney from "../Utils";

class SharesManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountShares: null,
      latestPrices: null
    };

    this.calculateTotalShareHoldings = this.calculateTotalShareHoldings.bind(
      this
    );
    this.displayTotalShareHoldings = this.displayTotalShareHoldings.bind(this);
    this.calculateTotalShareExpenditure = this.calculateTotalShareExpenditure.bind(
      this
    );
    this.displayTotalShareExpenditure = this.displayTotalShareExpenditure.bind(
      this
    );
  }

  async componentDidMount() {
    const { data: accountShares } = await axios.get(
      "/accounts/1/shares"
    );

    this.setState({
      accountShares
    });

    const { data: latestPrices } = await axios.get(
      "/accounts/1/shares/latestprices"
    );

    this.setState({
      latestPrices
    });
  }

  calculateTotalShareHoldings() {
    const { accountShares, latestPrices } = this.state;

    const total = accountShares.reduce(function(acc, share) {
      if (typeof latestPrices[share.symbol] === "number") {
        acc = acc + latestPrices[share.symbol] * share.units;
      }
      return acc;
    }, 0);

    return total;
  }

  displayTotalShareHoldings() {
    const total = this.calculateTotalShareHoldings();
    return <span className="totalShareValue"> $ {formatMoney(total)} </span>;
  }

  calculateTotalShareExpenditure() {
    const { accountShares } = this.state;

    const total = accountShares.reduce(function(acc, share) {
      if (typeof share.totalPurchasePrice === "number") {
        acc = acc + share.totalPurchasePrice;
      }
      return acc;
    }, 0);

    return total;
  }

  displayTotalShareExpenditure() {
    const total = this.calculateTotalShareExpenditure();
    return <span className="total"> $ {formatMoney(total)} </span>;
  }

  render() {
    const loadedShares = this.state.accountShares !== null;
    const loadedLatestPrices = this.state.latestPrices !== null;

    return (
      <div className="container">
        {!loadedShares && <Loading />}
        {loadedLatestPrices && loadedShares ? (
          <>
            <h3 className="totalShareValue">
              Total Share Holdings: {this.displayTotalShareHoldings()}
            </h3>
            <h3 className="totalShareValue">
              Total Expenditure: {this.displayTotalShareExpenditure()}
            </h3>
          </>
        ) : (
          <>
            <h3 className="totalShareValue">Total Share Holdings: ...</h3>
            <h3 className="totalExpenditureValue">Total Expenditure: ...</h3>
          </>
        )}
        <div className="row">
          {loadedShares &&
            this.state.accountShares.map(shares => (
              <div key={shares.symbol} className="col-sm-12 col-md-4 col-lg-3">
                <SharesCard
                  symbol={shares.symbol}
                  market={shares.market}
                  name={shares.name}
                  units={shares.units}
                  totalPurchasePrice={shares.totalPurchasePrice}
                  latestPrice={
                    loadedLatestPrices
                      ? this.state.latestPrices[shares.symbol]
                      : null
                  }
                />
              </div>
            ))}
          <div className="buySharesCard">
            <Link to="/buy-shares">
              <div className="card text-dark bg-white mb-3">
                <div className="card-header">Want to purchase more shares?</div>
                <div className="card-body">
                  <h4 className="card-title">+ Buy Shares</h4>
                  <p className="card-text">
                    There's no better time than the present.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SharesManager;
