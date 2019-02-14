import React from "react";
import Questions from "./Questions/Questions";
import Wallet from "./Wallet/Wallet";
import SharesManager from "./SharesManager/SharesManager";

class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <Wallet />
        </div>
        <SharesManager />
      </div>
    );
  }
}

export default Home;
