import React from "react";

class WalletOptions extends React.Component {
  render() {
    const { increaseBalance, decreaseBalance } = this.props;

    return (
      <div className="wallet-options">
        <button
          type="button"
          className="btn btn-primary"
          onClick={increaseBalance}
        >
          + Top Up
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={decreaseBalance}
        >
          - Reduce
        </button>
      </div>
    );
  }
}

export default WalletOptions;
