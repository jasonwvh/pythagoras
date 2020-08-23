import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Assignment, Course } from "../models";
let subscription;

export default class CourseEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseID: props.match.params.id,
            title: "",
            courseCopy: "",
            assignments: [],
        };
    }

    componentDidMount() {
        this.getCopy();
        this.getData();

        subscription = DataStore.observe(Assignment).subscribe(() => {
            this.getData();
        });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getCopy() {
        const course = await DataStore.query(Course, (c) => c.id("eq", this.state.courseID));
                        
        this.setState({
            title: course[0].title,
            courseCopy: course[0],
        })
    }

    async getData() {
        const assignments = await DataStore.query(Assignment, (c) => c.courseID("eq", this.state.courseID));

        this.setState({ 
            assignments: assignments,
        })
    }

    handleChange = (e) => {
        switch (e.target.id) {
            case "title":
                this.setState({ title: e.target.value });
                break;
            default:
                break;
        }
    };

    async handleAddAssignment() {
        await DataStore.save(
            new Assignment({
                title: "Placeholder assignment ".concat(
                    Math.floor(Math.random() * 10)
                ),
                courseID: this.state.courseID,
            })
        );
    }

    async handleDeleteAssignment(id) {
        await DataStore.delete(Assignment, (c) => c.id("eq", id));
    }

    async handleSave() {
        await DataStore.save(
            Assignment.copyOf(this.state.courseCopy, updated => {
              updated.title = this.state.title;
            })
          );
          this.props.history.goBack();
    }

    render() {
        const { courseID, title, assignments } = this.state

        return (
            <div>
                <p>Edit {courseID}</p>
                <form>
                    <label> Title </label>
                    <input
                        id="title"
                        placeholder="Enter title"
                        onChange={(e) => this.handleChange(e)}
                        value={title}
                    />
                </form>
                {assignments && assignments.map((assignment, i) => (
                    <div key={i}>
                        <p> {assignment.title} </p>
                        <Link
                            to={{
                                pathname: `/editAssignment/${assignment.id}`,
                                state: { assignmentID: assignment.id },
                            }}
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => this.handleDeleteAssignment(assignment.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {!assignments && <p> not found </p>}

                <button onClick={() => this.handleAddAssignment()}>
                    Add assignment
                </button>
                    <button onClick={() => this.handleSave()}>Save course</button>
            </div>
        );
    }
}
