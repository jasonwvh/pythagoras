import React from "react";
import { Link } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Course, Enrollment } from "../models";
let subscription;


export default class StudentPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            enrollment: "",
            courses: [],
        };
    }

    componentDidMount() {
        this.getData();

        subscription = DataStore.observe(Enrollment).subscribe((msg) => {
            this.getData();
        });

        console.log(this.state.enrollment)
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getData() {
        const user = await Auth.currentAuthenticatedUser();
        const courses = await DataStore.query(Course);
        this.setState({
            username: user.username,
            courses: courses,
        });
    }

    async onJoinCourse(id) {
        const ori = await DataStore.query(Course, (c) => c.id("eq", id))

        let list = Object.assign([], ori[0].students);
        
        list.push(this.state.username)
        
        await DataStore.save(
          Course.copyOf(ori[0], updated => {
            updated.students = list;
          })
        );

        const enrollment = await DataStore.save(
            new Enrollment({
                classroomID: ori[0].id,
                classroomTitle: ori[0].title,
                studentUsername: this.state.username,
                progress: 50,
            })
        )

        this.setState({ enrollment })
    }

    render() {
        return (
            <div>
                <div>
                    <p> Welcome {this.state.username} </p>
                </div>
                <span>
                    <Link to="/studentProfile">Go To Profile</Link>
                </span>
                <div>
                    {this.state.courses.map((course, i) => (
                        <div key={i}>
                            <p> {course.title} </p>
                            <Link
                            to={{
                                pathname: `/course/${course.id}`,
                                state: { courseID: course.id },
                            }}
                        >
                            Go to course
                        </Link>
                            <p> Students in this course {course.students} </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
