import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import StudentPage from './components/StudentPage'
import StudentProfile from './components/StudentProfile'
import QuizPractice from './components/QuizPractice';
import Teacher from './components/Teacher'
import QuizReview from './components/QuizReview'
import QuizCreate from './components/QuizCreate'

import { Route, BrowserRouter, Switch } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
Amplify.configure(awsmobile);

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/studentPage" component={StudentPage} />
          <Route path="/studentProfile" component={StudentProfile} />
          <Route path="/practice/:id/:question" component={QuizPractice} />
          <Route path="/practice/:id" component={QuizPractice} />
          <Route path="/teacher" component={Teacher} /> 
          <Route path="/review/:id" component={QuizReview} />
          <Route path="/create" component={QuizCreate} />
        </Switch>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
