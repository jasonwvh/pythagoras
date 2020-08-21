import React from "react";
import { Auth } from '@aws-amplify/auth'
import { DataStore } from "@aws-amplify/datastore";
import { Classroom, ClassEnrollment } from "../models";

export default class StudentProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            enrollments: [],
            classrooms: [],
        };
    }

    componentDidMount() {
        this.getUserClassrooms();
    }

    async getUserClassrooms() {
        console.log("getting classes")
        const user = await Auth.currentAuthenticatedUser();

        const enrollments = await DataStore.query(ClassEnrollment, c => c.studentUsername("eq", user.username))
        console.log(enrollments)
        this.setState({ enrollments })

        let enrollmentsID = enrollments.map(c => c.classroomID)
        console.log(enrollmentsID)

        await DataStore.query(Classroom, (c) =>
        c.or((c) => enrollmentsID.reduce((c, classroomID) => c.id("eq", classroomID), c))
        ).then((results) => {
            console.log("matching", results.length, results)
            this.setState({ classrooms: results })
        });
      }

    render() {
        return(
            <div>
                {this.state.enrollments && this.state.enrollments.map((classroom, i) => (
                        <div key={i}>
                            <p>
                                Title {classroom.classroomTitle}
                            </p>
                            <p>
                                Progress {classroom.progress}
                            </p>
                        </div>
                    ))}
                    {!this.state.classrooms && <p>not found</p>}
            </div>
        )
    }
}