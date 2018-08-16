import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  AppAside,
  AppFooter,
  AppHeader,
} from '@coreui/react';

import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import Notarize from '../Notarize/Notarize';
import Verify from '../Verify/Verify';
import Modals from '../../components/Modals/Modals';
import getWeb3 from '../../utils/getWeb3';

class DefaultLayout extends Component {

  state = { }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
        .then(results => {
          let value = results.web3.eth.coinbase.toLowerCase();
          console.log(value);
            this.setState({
                web3: results.web3,
                address: value
            })

            // Instantiate contract once web3 provided.
            //this.instantiateContract()
        })
        .catch(() => {
            console.log('Error finding web3.')
        })
}



  render() {

    return (
      <div className="app">
        <AppHeader fixed >
          <DefaultHeader address={this.state.address} />
        </AppHeader>
        <div className="app-body">
          <main className="main">
            <Router>
              <div>
                <Route exact path="/" component={Notarize} />
                <Route path="/verify" component={Verify} />
                <Route path="/settings" component={Modals} />
              </div>
            </Router>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
