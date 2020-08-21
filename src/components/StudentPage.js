import React from "react";
import { Link } from "react-router-dom";
import { Auth } from '@aws-amplify/auth'
import { DataStore } from "@aws-amplify/datastore";
import { Quiz, Classroom, ClassEnrollment } from "../models";
let subscription;

export default class StudentPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            quizzes: [],
            classrooms: [],
        };
    }

    componentDidMount() {
        this.getUserInfo();
        this.onQueryQuiz();
        this.onQueryClassroom();

        subscription = DataStore.observe(Classroom).subscribe(msg => {
            console.log(msg.model, msg.opType, msg.element);
            this.onQueryClassroom();
          });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getUserInfo() {
        const user = await Auth.currentAuthenticatedUser();
        console.log('username is ' + user.username)

        this.setState ({ username: user.username })
      }

    async onQueryQuiz() {
        const quizzes = await DataStore.query(Quiz);
        console.log('quizzes is ' + quizzes)
        this.setState({ quizzes });
    }

    async onQueryClassroom() {
        const classrooms = await DataStore.query(Classroom);
        console.log('classrooms is ' + classrooms)
        this.setState({ classrooms });
    }

    async onJoinClassroom(id) {
        const oriClassroom = await DataStore.query(Classroom, (c) => c.id("eq", id))
        console.log("ori " + oriClassroom.students)
        console.log("ori0 " + oriClassroom[0].students)

        let newStudents = Object.assign([], oriClassroom[0].students);
        newStudents.push(this.state.username)
        console.log("new list " + newStudents)

        await DataStore.save(
          Classroom.copyOf(oriClassroom[0], updated => {
            updated.students = newStudents;
          })
        );

        const enroll = await DataStore.save(
            new ClassEnrollment({
                classroomID: oriClassroom[0].id,
                classroomTitle: oriClassroom[0].title,
                studentUsername: this.state.username,
                progress: 50,
            })
        )
        console.log(enroll)
    }

    render() {
        return (
            <div>
                <div className="header">
                    <span><Link to="/studentProfile">Profile</Link></span>
                    <p> {this.state.username} </p>
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
                            <button onClick={() => this.onJoinClassroom(classroom.id)}> Join Classroom </button>
                            <p> {classroom.students} </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
