import React from "react";
import WalletOptions from "./WalletOptions";

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { wallet: 0.0, originalAmount: null };
    this.increaseBalance = this.increaseBalance.bind(this);
    this.decreaseBalance = this.decreaseBalance.bind(this);
  }

  increaseBalance() {
    const { wallet, originalAmount } = this.state;
    let newOriginalAmount;
    if (originalAmount === null) {
      newOriginalAmount = wallet;
    } else {
      newOriginalAmount = originalAmount; // unchanged
    }
    const newAmount = wallet + 1;
    this.setState({
      wallet: newAmount,
      originalAmount: newOriginalAmount
    });
  }

  decreaseBalance() {
    const { wallet } = this.state;
    if (wallet > 0) {
      const newAmount = wallet - 1;
      this.setState({
        wallet: newAmount
      });
    }
  }

  render() {
    const { wallet } = this.state;
    return (
      <div className="container wallet">
        <div className="row">
          <h1 className="balance align-left">Cash Balance: {wallet}</h1>
          <WalletOptions
            increaseBalance={this.increaseBalance}
            decreaseBalance={this.decreaseBalance}
          />
        </div>
      </div>
    );
  }
}

export default Wallet;
