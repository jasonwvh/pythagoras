import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Course } from "../models";

let subscription;

export default class TeacherPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
        };
    }

    componentDidMount() {
        this.getData();

        subscription = DataStore.observe(Course).subscribe((msg) => {
            this.getData();
        });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getData() {
        const courses = await DataStore.query(Course);

        this.setState({ courses });
    }

    async handleCreateCourse() {
        await DataStore.save(
            new Course({
                title: "Placeholder title ".concat(
                    Math.floor(Math.random() * 10)
                ),
                students: [""],
                assignments: [""],
            })
        );
    }

    async handleDeleteCourse(id) {
        await DataStore.delete(Course, (c) => c.id("eq", id));
    }

    render() {
        return (
            <div>
                {this.state.courses.map((course, i) => (
                    <div key={i}>
                        <p> {course.title} </p>
                        <Link
                            to={{
                                pathname: `/editCourse/${course.id}`,
                                state: { courseID: course.id },
                            }}
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => this.handleDeleteCourse(course.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}

                <button onClick={() => this.handleCreateCourse()}>
                    Create New Course
                </button>
            </div>
        );
    }
}
