import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading";
import SharesCard from "./SharesCard";

class AccountsManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountShares: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axios.get("/accounts/1/").then(data => {
      console.log(data);
      if (this._isMounted) {
        this.setState({
          accountShares: data
        });
      }
    });
    // console.log(this.state.accountShares);
  }

  componentWillUnmount() {
    this._isMounted = false;
    // this.gettingShares;
  }

  render() {
    const loading = this.state.accountShares === null;

    return (
      <div className="container">
        <div className="row">
          {loading && <Loading />}
          {!loading &&
            this.state.accountShares.map(shares => (
              <div key={shares.symbol} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/account/shares/${shares.symbol}`}>
                  <SharesCard
                    symbol={shares.symbol}
                    market={shares.market}
                    name={shares.name}
                    units={shares.units}
                    totalPurchasePrice={shares.totalPurchasePrice}
                  />
                </Link>
              </div>
            ))}
          <Link to="/accounts/1/buynew">
            <div className="card bg-light mb-3" style={{ maxWidth: "20rem" }}>
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
    );
  }
}

export default SharesManager;
