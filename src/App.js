import React from "react";
import "./App.css";

import Student from './components/Student'
import QuizPractice from './components/QuizPractice';
import QuizReview from './components/QuizReview'

import { Route, BrowserRouter, Switch } from "react-router-dom";

import Amplify from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Student} />
          <Route path="/practice/:id/:question" component={QuizPractice} />
          <Route path="/practice/:id" component={QuizPractice} />
          <Route path="/review/:id" component={QuizReview} />
          <Route component={Student} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withAuthenticator(App)