import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { DataStore } from "@aws-amplify/datastore";
import { Quiz, Classroom } from "../models";
let subscription;

export default class Teacher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quizzes: [],
            classrooms: [],
        };
    }

    componentDidMount() {
        this.onQueryQuiz();
        this.onQueryClassroom() 

        subscription = DataStore.observe(Classroom).subscribe((msg) => {
            console.log(msg.model, msg.opType, msg.element);
            this.onQueryClassroom()
        });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async onCreateClassroom() {
        const classes = await DataStore.save(
            new Classroom({
                title: "New class ".concat(Math.floor(Math.random() * 10)),
                students: []
            })
        );

        console.log(classes);
    }

    async onQueryQuiz() {
        const quizzes = await DataStore.query(Quiz);

        this.setState({ quizzes });
    }

    async onQueryClassroom() {
        const classrooms = await DataStore.query(Classroom);

        this.setState({ classrooms });
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
                    {this.state.classrooms.map((classroom, i) => (
                        <div key={i} className="quizContainer">
                            <p> {classroom.title} </p>
                        </div>
                    ))}
                </div>

                <div>
                    <Button onClick={this.onCreateClassroom}>
                        Create Classroom
                    </Button>
                    <Link
                        className={"title "}
                        to={{
                            pathname: `/create`,
                        }}
                    >
                        Create Quiz
                    </Link>
                </div>
            </div>
        );
    }
}
