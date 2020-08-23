import React from "react";
import { Link } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Assignment, Course, Enrollment } from "../models";

export default class CoursePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseID: props.match.params.id,
            username: "",
            courseCopy: "",
            enrolled: false,
            assignments: [],
            enrollment: '',
        };
    }

    componentDidMount() {
        this.getData()

    }

    componentWillUnmount() {

    }

    async getData() {
        const user = await Auth.currentAuthenticatedUser();
        const course = await DataStore.query(Course, (c) => c.id("eq", this.state.courseID));
        const assignments = await DataStore.query(Assignment, (c) => c.courseID("eq", this.state.courseID));
        const enrollment = await DataStore.query(Enrollment, 
            c => {
                c.courseID("eq", course[0].id);
                c.studentUsername("eq", user.username)
            }
        );

        let students = course[0].students
        if (students.indexOf(user.username) > -1) {
            this.setState({ enrolled: true })
        }

        this.setState({
            courseCopy: course,
            assignments: assignments,
            username: user.username,
            enrollment: enrollment[0],
        })

        console.log(enrollment)
    }

    async handleJoinCourse() {
        const ori = this.state.courseCopy
        let list = Object.assign([], ori[0].students);
        list.push(this.state.username)

        console.log(ori)
        await DataStore.save(
          Course.copyOf(ori[0], updated => {
            updated.students = list;
          })
        );

        const enroll = await DataStore.save(
            new Enrollment({
                courseID: ori[0].id,
                courseTitle: ori[0].title,
                studentUsername: this.state.username,
                progress: 50,
            })
        )
        console.log("joined", enroll)
        
        this.setState({
            enrolled: true,
            enrollment: enroll })
    }

    async handleLeaveCourse() {
        const ori = this.state.courseCopy
        let list = Object.assign([], ori[0].students);
        // eslint-disable-next-line 
        list = list.filter((c) => c != this.state.username)

        await DataStore.save(
            Course.copyOf(ori[0], updated => {
              updated.students = list;
            })
          )

        console.log(this.state.enrollment)

        await DataStore.delete(Enrollment, (c) => c.id("eq", this.state.enrollment.id))

        this.setState({ enrolled: false,})
    }

    render() {
        return (
            <div>
                <p> {this.state.courseID} </p>

                {this.state.enrolled 
                ? <button onClick={() => this.handleLeaveCourse()}>Leave Course</button> 
                : <button onClick={() => this.handleJoinCourse()}>Join Course</button>
                }
                
                {this.state.enrolled && this.state.assignments && 
                    this.state.assignments.map((assignment, i) => (
                        <div key={i}>
                        <p> {assignment.title} </p>
                        <Link
                            to={{
                                pathname: `/practice/${assignment.id}`,
                                state: { assignmentID: assignment.id },
                            }}
                        >
                            Practice
                        </Link>
                    </div>
                    ))
                }
            </div>
        );
    }
}
