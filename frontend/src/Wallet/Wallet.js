import React from "react";
import axios from "axios";
import WalletOptions from "./WalletOptions";
import formatMoney from "../Utils";

const walletIncrementAndDecrementValue = 100;

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { wallet: null };
    this.increaseBalance = this.increaseBalance.bind(this);
    this.decreaseBalance = this.decreaseBalance.bind(this);
  }

  async componentDidMount() {
    const { data } = await axios.get(
      process.env.REACT_APP_BACKEND_API + "/accounts/1/wallet"
    );
    const wallet = data.wallet;
    this.setState({
      wallet: parseFloat(wallet)
    });
  }

  async increaseBalance() {
    const { wallet: currentAmount } = this.state;
    const newAmount = currentAmount + walletIncrementAndDecrementValue;

    const { data } = await axios.post(
      process.env.REACT_APP_BACKEND_API + "/accounts/1/wallet",
      {
        wallet: parseFloat(newAmount)
      }
    );
    const wallet = data.wallet;
    this.setState({
      wallet: parseFloat(wallet)
    });
  }

  async decreaseBalance() {
    const { wallet: currentAmount } = this.state;
    const newAmount = currentAmount - walletIncrementAndDecrementValue;
    if (newAmount > 0) {
      const { data } = await axios.post(
        process.env.REACT_APP_BACKEND_API + "/accounts/1/wallet",
        {
          wallet: parseFloat(newAmount)
        }
      );
      const wallet = data.wallet;
      this.setState({
        wallet: parseFloat(wallet)
      });
    }
  }

  render() {
    const { wallet } = this.state;
    const walletLoaded = wallet !== null;

    return (
      <div className="container wallet">
        <div className="row">
          {walletLoaded ? (
            <>
              <h1 className="balance align-left">
                Cash Balance: $ {formatMoney(wallet)}
              </h1>
              <WalletOptions
                increaseBalance={this.increaseBalance}
                decreaseBalance={this.decreaseBalance}
              />
            </>
          ) : (
            <h1 className="balance align-left">Cash Balance: ... </h1>
          )}
        </div>
      </div>
    );
  }
}

export default Wallet;
