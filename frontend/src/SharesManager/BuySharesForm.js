import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "../Auth";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";

class BuySharesForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      symbol: "",
      units: 0
    };
  }

  updateUnits(value) {
    this.setState({
      units: parseInt(value)
    });
  }

  updateSymbol(value) {
    this.setState({
      symbol: value,
      disabled: true
    });
  }

  async getCurrentCost() {
    const { data: latestPrices } = await axios.get(
      "/accounts/1/shares/latestprices"
    );

    this.setState({
      latestPrices
    });
  }

  async submit() {
    this.setState({
      disabled: true
    });

    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => alert("Click Yes")
        },
        {
          label: "No",
          onClick: () => alert("Click No")
        }
      ]
    });

    await axios.post(
      "/buyshares",
      {
        symbol: this.state.symbol,
        units: this.state.units
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );

    console.log("here");

    this.props.history.push("/");
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-header">Buy More Shares</div>
              <div className="card-body text-left">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Symbol:</label>
                  <input
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={e => {
                      this.updateSymbol(e.target.value);
                    }}
                    className="form-control"
                    placeholder="eg. GOOG"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Units:</label>
                  <input
                    disabled={this.state.disabled}
                    type="number"
                    onBlur={e => {
                      this.updateUnits(e.target.value);
                    }}
                    className="form-control"
                    placeholder="eg. 7"
                  />
                </div>
                <button
                  disabled={this.state.disabled}
                  className="btn btn-primary"
                  onClick={() => {
                    this.submit();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BuySharesForm);
