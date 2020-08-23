import React from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Question } from "../models";

export default class QuestionEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            questionID: props.match.params.id,
            questionCopy: "",
            question: "",
            title: "",
            choiceOne: "",
            choiceTwo: "",
            choiceThree: "",
            choiceFour: "",
            solution: 1,
            explanation: "",
        };
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const question = await DataStore.query(Question, (c) =>
            c.id("eq", this.state.questionID)
        );

        let q, c1, c2, c3, c4, sol, exp;

        if (question[0].question) {
            q = question[0].question
        }

        if (question[0].choices) {
            c1 = question[0].choices[0]
            c2 = question[0].choices[1]
            c3 = question[0].choices[2]
            c4 = question[0].choices[3]
        }
        
        if (question[0].solution) {
            sol = question[0].solution
        }

        if (question[0].explanation) {
            exp = question[0].explanation
        }

        this.setState({
            questionCopy: question[0],
            title: question[0].title,
            question: q,
            choiceOne: c1,
            choiceTwo: c2,
            choiceThree: c3,
            choiceFour: c4,
            solution: sol,
            explanation: exp,
        });

    }

    handleChange = (e) => {
        switch (e.target.id) {
            case "quest":
                this.setState({ question: e.target.value });
                break;
            case "choiceOne":
                this.setState({ choiceOne: e.target.value });
                break;
            case "choiceTwo":
                this.setState({ choiceTwo: e.target.value });
                break;
            case "choiceThree":
                this.setState({ choiceThree: e.target.value });
                break;
            case "choiceFour":
                this.setState({ choiceFour: e.target.value });
                break;
            case "solution":
                this.setState({ solution: parseInt(e.target.value) });
                break;
            case "explanation":
                this.setState({ explanation: e.target.value });
                break;
            default:
                break;
        }
    };

    async handleSave() {
        const { question, choiceOne, choiceTwo, choiceThree, choiceFour, solution, explanation } = this.state;
        const choices = [choiceOne, choiceTwo, choiceThree, choiceFour]

        console.log(choices)

        await DataStore.save(
            Question.copyOf(this.state.questionCopy, updated => {
                updated.question = question;
                updated.choices = choices;
                updated.solution = solution;
                updated.explanation = explanation;
            })
        );

        this.props.history.goBack();
    }

    render() {
        const {
            questionID,
            question,
            choiceOne,
            choiceTwo,
            choiceThree,
            choiceFour,
            solution,
            explanation,
        } = this.state;

        return (
            <div>
                <p>Edit {questionID}</p>
                <form>
                    <label> Question </label>
                    <input
                        id="quest"
                        placeholder="Enter question"
                        onChange={(e) => this.handleChange(e)}
                        value={question}
                    />
                    <label> Choice 1 </label>
                    <input
                        id="choiceOne"
                        placeholder="Choice 1"
                        onChange={(e) => this.handleChange(e)}
                        value={choiceOne}
                    ></input>
                    <label> Choice 2 </label>
                    <input
                        id="choiceTwo"
                        placeholder="Choice 2"
                        onChange={(e) => this.handleChange(e)}
                        value={choiceTwo}
                    ></input>
                    <label> Choice 3 </label>
                    <input
                        id="choiceThree"
                        placeholder="Choice 3"
                        onChange={(e) => this.handleChange(e)}
                        value={choiceThree}
                    ></input>
                    <label> Choice 4 </label>
                    <input
                        id="choiceFour"
                        placeholder="Choice 4"
                        onChange={(e) => this.handleChange(e)}
                        value={choiceFour}
                    ></input>
                    <label>Solution</label>
                    <select
                        id="solution"
                        value={solution}
                        onChange={(e) => this.handleChange(e)}
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>

                    <label>Explanation</label>
                    <input
                        as="textarea"
                        rows="3"
                        id="explanation"
                        placeholder="Explanation"
                        onChange={(e) => this.handleChange(e)}
                        value={explanation}
                    />
                </form>

                <button onClick={() => this.handleSave()}>Save question</button>
            </div>
        );
    }
}
