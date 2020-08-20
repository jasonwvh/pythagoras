import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap"

import { DataStore } from "@aws-amplify/datastore";
import { Quiz, Challenge, Classroom } from "../models";
let subscription;

export default class Teacher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quizzes: [],
        };
    }

    componentDidMount() {
        this.onQueryQuiz();

        subscription = DataStore.observe(Quiz).subscribe((msg) => {
            console.log("SUBSCRIPTION_UPDATE", msg);
            this.onQueryQuiz();
        });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async onCreateClassroom() {
        await DataStore.save(new Classroom({
            title: "New class",
            students: ["aa"],
        }))
    }

    async onQueryQuiz() {
        const quizzes = await DataStore.query(Quiz);

        this.setState({ quizzes });
    }

    async onDeleteQuiz(id) {
        await DataStore.delete(Quiz, (c) => c.id("eq", id));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <span>Pythagoras</span>
                </div>
                <div className="studyComponent">
                    {this.state.quizzes.map((quiz, i) => (
                        <div key={i} className="quizContainer">
                            <Link
                                className={"title "}
                                to={{
                                    pathname: `/review/${quiz.id}`,
                                    state: { quizID: quiz.id },
                                }}
                            >
                                {quiz.title}
                            </Link>
                            <Button onClick={() => this.onDeleteQuiz(quiz.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
                <div>
                    <Button onClick={this.onCreateClassroom}>Create Classroom</Button>
                    <Link
                        className={"title "}
                        to={{
                            pathname: `/create`
                        }}
                    >
                        Create Quiz
                    </Link>
                </div>
            </div>
        );
    }
}