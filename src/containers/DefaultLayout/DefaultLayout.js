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


class DefaultLayout extends Component {

  render() {

    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
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
