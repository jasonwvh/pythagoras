import React from "react";
import "./App.css";

import Student from './components/Student'
import QuizContainer from './components/QuizContainer';
import QuizReview from './components/QuizReview'

import { Route, BrowserRouter, Switch } from "react-router-dom";

import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

export default class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Student} />
          <Route path="/practice/:id/:question" component={QuizContainer} />
          <Route path="/practice/:id" component={QuizContainer} />
          <Route path="/review/:id" component={QuizReview} />
          <Route component={Student} />
        </Switch>
      </BrowserRouter>
    );
  }
}
