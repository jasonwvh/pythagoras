import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import App from "./App";

import StudentPage from "./components/StudentPage";
import StudentProfile from "./components/StudentProfile";
import CoursePage from "./components/CoursePage";
import AssignmentPractice from "./components/AssignmentPractice";

import TeacherPage from "./components/TeacherPage";
import CourseEdit from "./components/CourseEdit";
import AssignmentEdit from "./components/AssignmentEdit";
import QuestionEdit from "./components/QuestionEdit";

import { Route, BrowserRouter, Switch } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
Amplify.configure(awsmobile);

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={App} />

                <Route path="/student" component={StudentPage} />
                <Route path="/studentProfile" component={StudentProfile} />
                <Route path="/course/:id" component={CoursePage} />
                <Route path="/practice/:id" component={AssignmentPractice} />

                <Route path="/teacher" component={TeacherPage} />
                <Route path="/editCourse/:id" component={CourseEdit} />
                <Route path="/editAssignment/:id" component={AssignmentEdit} />
                <Route path="/editQuestion/:id" component={QuestionEdit} />
            </Switch>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
