import React from "react";
import "./App.css";

import { Link } from "react-router-dom";

import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react';



class App extends React.Component {
  render () {
    return (
          <div>
            <AmplifySignOut />
            <h1>Welcome</h1>
            <p>I am a...</p>
                <nav>
                    <Link to="/studentPage">Student</Link>
                    <div></div>
                    <Link to="/teacher">Teacher</Link>
                </nav>
          </div>
    );
  }
}

export default withAuthenticator(App)
//export default App