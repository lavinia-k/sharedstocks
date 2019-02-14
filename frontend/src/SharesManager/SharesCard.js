import React from "react";
import { Link } from "react-router-dom";

class SharesCard extends React.Component {
  render() {
    const {
      symbol,
      name,
      market,
      units,
      totalPurchasePrice,
      latestPrice
    } = this.props;
    const hasLatestPriceAndIsValid =
      latestPrice !== null && typeof latestPrice === "number";
    const isLoadingPrice = latestPrice === null;

    return (
      <div className="sharesCard">
        <Link to={`/account/1/shares/${this.props.symbol}`}>
          <div
            className="card text-white bg-dark mb-3"
            style={{ maxWidth: "20rem" }}
          >
            <div className="card-header">
              {market}:{symbol}
            </div>
            <div className="card-body">
              <h4 className="card-title">{name}</h4>
              {name}
              <div className="card-text">
                <p className="units">Units: {units}</p>
                <p className="purchasedPrice">
                  Purchased Price: $ {totalPurchasePrice}
                </p>
                {hasLatestPriceAndIsValid ? (
                  <h6
                    className="sharesValue"
                    style={
                      latestPrice * units >= totalPurchasePrice
                        ? { color: "#4caf50" }
                        : { color: "#b35858" }
                    }
                  >
                    $ {Number(latestPrice * units).toFixed(2)}
                  </h6>
                ) : (
                  <h6 className="sharesValue">
                    {isLoadingPrice ? "..." : "N/A"}
                  </h6>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default SharesCard;
