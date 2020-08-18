import React from "react";
import "./App.css";

import { Link } from "react-router-dom";

import Amplify from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

class App extends React.Component {
  render () {
    return (
          <div>
            <h1>Welcome</h1>
            <p>I am a...</p>
                <nav>
                    <Link to="/student">Student</Link>
                    <div></div>
                    <Link to="/teacher">Teacher</Link>
                </nav>
          </div>
    );
  }
}

export default withAuthenticator(App)