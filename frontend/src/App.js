import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import auth0Client from "./Auth";
import NavBar from "./NavBar/NavBar";
import Question from "./Question/Question";
import Home from "./Home";
import Callback from "./Callback";
import NewQuestion from "./NewQuestion/NewQuestion";
import SecuredRoute from "./SecuredRoute/SecuredRoute";
import { connect } from "react-redux";
import { simpleAction } from "./redux/actions/simpleAction";
import SharesDetail from "./SharesManager/SharesDetail";
import BuySharesForm from "./SharesManager/BuySharesForm";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true
    };
  }

  async componentDidMount() {
    if (this.props.location.pathname === "/callback") {
      this.setState({ checkingSession: false });
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== "login_required") console.log(err.error);
    }
    this.setState({ checkingSession: false });
  }

  simpleAction = event => {
    this.props.simpleAction();
  };

  render() {
    return (
      <div>
        <NavBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/question/:questionId" component={Question} />
        <Route exact path="/callback" component={Callback} />
        <SecuredRoute path="/new-question" component={NewQuestion} />
        <SecuredRoute path="/buy-shares" component={BuySharesForm} />
        <SecuredRoute
          path="/accounts/:id/shares/:symbol"
          component={SharesDetail}
        />
        <SecuredRoute path="/test" component={SharesDetail} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
