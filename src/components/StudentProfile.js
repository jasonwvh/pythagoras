import React from "react";
import { Auth } from '@aws-amplify/auth'
import { DataStore } from "@aws-amplify/datastore";
import { Course, Enrollment } from "../models";

export default class StudentProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            enrolled: false,
            enrollments: [],
            courses: [],
        };
    }

    componentDidMount() {
        this.getUserCourses();

        
    }

    async getUserCourses() {
        const user = await Auth.currentAuthenticatedUser();

        const enrollments = await DataStore.query(Enrollment, c => c.studentUsername("eq", user.username))

        let enrollmentsID = enrollments.map(c => c.courseID)

        await DataStore.query(Course, (c) =>
        c.or((c) => enrollmentsID.reduce((c, courseID) => c.id("eq", courseID), c))
        ).then((results) => {
            this.setState({ courses: results })
        });

        this.setState({ enrollments })
        console.log(this.state.enrollments)
      }

    render() {
        return(
            <div>
                {this.state.enrollments && this.state.enrollments.map((course, i) => (
                        <div key={i}>
                            <p>
                                Title {course.courseTitle}
                            </p>
                            <p>
                                Progress {course.progress}
                            </p>
                        </div>
                    ))}
                    {!this.state.enrollments}
            </div>
        )
    }
}