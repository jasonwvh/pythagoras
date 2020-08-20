import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Quiz, Challenge, Classroom } from "../models";
let subscriptionQuiz;
let subscriptionClassroom;

export default class Student extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quizzes: [],
            classrooms: [],
        };
    }

    componentDidMount() {
        this.onQueryQuiz();
        this.onQueryClassroom();

        subscriptionQuiz = DataStore.observe(Quiz).subscribe((msg) => {
            console.log("SUBSCRIPTION_UPDATE", msg);
            this.onQueryQuiz();
        });

        subscriptionClassroom = DataStore.observe(Classroom).subscribe((msg) => {
            console.log("SUBSCRIPTION_UPDATE", msg);
            this.onQueryClassroom();
        });
    }

    componentWillUnmount() {
        subscriptionQuiz.unsubscribe();
    }

    async onQueryQuiz() {
        const quizzes = await DataStore.query(Quiz);

        this.setState({ quizzes });
    }

    async onQueryClassroom() {
        const classrooms = await DataStore.query(Classroom);

        this.setState({ classrooms });
    }

    async onFollowClassroom(id) {
        const ori = await DataStore.query(Classroom, (c) => c.id("eq", id))

        console.log(ori[0].title)

        let stud = Object.assign([], ori[0].students);
        stud.push('me')
        console.log(stud)

        await DataStore.save(
          Classroom.copyOf(ori[0], updated => {
            updated.students = stud;
          })
        );
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
                                    pathname: `practice/${quiz.id}`,
                                    state: { quizID: quiz.id },
                                }}
                            >
                                {quiz.title}
                            </Link>
                        </div>
                    ))}
                    {this.state.classrooms.map((classroom, i) => (
                        <div key={i} className="quizContainer">
                            <p> {classroom.title} </p>
                            <button onClick={() => this.onFollowClassroom(classroom.id)}> Follow Classroom </button>
                            <p> Students </p>
                            <p> {classroom.students} </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
