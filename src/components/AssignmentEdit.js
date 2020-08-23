import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Assignment, Question } from "../models";
let subscription;

export default class AssignmentEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assignmentID: props.match.params.id,
            title: "",
            assignmentCopy: "",
            questions: [],
        };
    }

    componentDidMount() {
        this.getCopy();
        this.getData();

        subscription = DataStore.observe(Question).subscribe((msg) => {
            this.getData();
        });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getCopy() {
        const assignment = await DataStore.query(Assignment, (c) => c.id("eq", this.state.assignmentID));
                        
        this.setState({
            title: assignment[0].title,
            assignmentCopy: assignment[0],
        })
    }

    async getData() {
        const questions = await DataStore.query(Question, (c) => c.assignmentID("eq", this.state.assignmentID));
                
        this.setState({ 
            questions: questions,
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

    async handleAddQuestion() {
        await DataStore.save(
            new Question({
                title: "Placeholder question ".concat(
                    Math.floor(Math.random() * 10)
                ),
                assignmentID: this.state.assignmentID,
                choices: ["", "", "", ""],
            })
        );
    }

    async handleDeleteQuestion(id) {
        await DataStore.delete(Question, (c) => c.id("eq", id));
    }

    async handleSave() {
        await DataStore.save(
            Assignment.copyOf(this.state.assignmentCopy, updated => {
              updated.title = this.state.title;
            })
          );

          this.props.history.goBack();
    }

    render() {
        const { assignmentID, title, questions } = this.state

        return (
            <div>
                <p>Edit {assignmentID}</p>
                <form>
                    <label> Title </label>
                    <input
                        id="title"
                        placeholder="Enter title"
                        onChange={(e) => this.handleChange(e)}
                        value={title}
                    />
                </form>
                {questions && questions.map((question, i) => (
                    <div key={i}>
                        <p> Question {i+1} </p>
                        <Link
                            to={{
                                pathname: `/editQuestion/${question.id}`,
                                state: { questionID: question.id },
                            }}
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => this.handleDeleteQuestion(question.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}{!questions && <p>no data</p>}
                <button onClick={() => this.handleAddQuestion()}>Add question</button>
                <button onClick={() => this.handleSave()}>Save assignment</button>
            </div>
        );
    }
}
