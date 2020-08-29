import React from "react";
import { Link } from "react-router-dom";

import { DataStore } from "@aws-amplify/datastore";
import { Assignment, Question } from "../models";

import "antd/dist/antd.css";
import { Button, Menu, Dropdown, Progress } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default class AssignmentPractice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentID: props.match.params.id,
            assignment: [],
            questions: [],

            count: 0,
            score: 0,
            explanation: "",

            questionAnswered: false,
            answerCorrect: null,

            complete: false,
            showButton: false,
            classNames: ["", "", "", ""],
        };
        this.nextQuestion = this.nextQuestion.bind(this);
        this.handleShowButton = this.handleShowButton.bind(this);
        this.handleIncreaseScore = this.handleIncreaseScore.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
    }

    async componentDidMount() {
        const assignment = await DataStore.query(Assignment, (c) =>
            c.id("eq", this.state.assignmentID)
        );
        const questions = await DataStore.query(Question, (c) =>
            c.assignmentID("eq", this.state.assignmentID)
        );
        console.log(assignment);
        console.log(questions);

        this.setState({ assignment: assignment });
        this.setState({ questions: questions });

        let { count } = this.state;
        this.insertData(count);
    }

    handleShowButton() {
        this.setState({
            showButton: true,
            questionAnswered: true,
        });
    }

    handleIncreaseScore() {
        this.setState({
            score: this.state.score + 1,
        });
    }

    insertData(count) {
        this.setState({
            question: this.state.questions[count].question,
            choices: this.state.questions[count].choices,
            solution: this.state.questions[count].solution,
            explanation: this.state.questions[count].explanation,
            total: this.state.questions.length,
            count: this.state.count + 1,
        });
    }

    nextQuestion() {
        let { count, total } = this.state;
        this.clearClasses();

        if (count === total) {
            this.setState({
                complete: true,
                count: this.state.count + 1,
            });
        } else {
            this.insertData(count);
            this.setState({
                showButton: false,
                questionAnswered: false,
            });
        }
    }

    checkAnswer(e) {
        let { questionAnswered } = this.state;

        if (!questionAnswered) {
            let { solution, answerCorrect } = this.state;

            let elem = e.currentTarget;
            let answer = Number(elem.dataset.id);

            let updatedClassNames = this.state.classNames;

            if (answer === solution) {
                answerCorrect = true;
                updatedClassNames[answer - 1] = "right";
                this.handleIncreaseScore();
            } else {
                answerCorrect = false;
                updatedClassNames[answer - 1] = "wrong";
            }

            this.setState({
                classNames: updatedClassNames,
                answerCorrect: answerCorrect,
            });

            this.handleShowButton();
        }
    }
    clearClasses() {
        this.setState({
            classNames: ["", "", "", ""],
        });
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link to="/student">Switch to Student</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/">Back to Menu</Link>
                </Menu.Item>
            </Menu>
        );

        const alphabets = ["A", "B", "C", "D"];

        let {
            count,
            total,
            score,
            question,
            choices,
            explanation,
            showButton,
            classNames,
            answerCorrect,
            questionAnswered,
            complete,
        } = this.state;

        let percent = ((count - 1) / total) * 100;

        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Pythagoras</h1>
                    <h1>Practice</h1>
                    <Dropdown overlay={menu}>
                        <Button>
                            More <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <Progress percent={percent} />
                <div style={styles.centered}>
                    {!complete && (
                        <div>
                            <div style={styles.question}>
                                <h1> {question} </h1>
                            </div>
                            <div id="answers">
                                <ul>
                                    {choices &&
                                        choices.map((choice, i) => (
                                            <li
                                                key={i}
                                                className={classNames[i]}
                                                data-id={i + 1}
                                                onClick={this.checkAnswer}
                                            >
                                                {" "}
                                                <span>{alphabets[i]}</span>
                                                <p>{choice}</p>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            {questionAnswered && answerCorrect != null && (
                                <div className="messageDiv">
                                    {answerCorrect ? (
                                        <h1 className="correctAnswer">
                                            Correct, great work!
                                        </h1>
                                    ) : (
                                        <h1 className="wrongAnswer">
                                            Sorry, that is not correct!
                                        </h1>
                                    )}
                                    {explanation && !answerCorrect && (
                                        <div className="explanation">
                                            <h3>Explanation:</h3>
                                            <p>{explanation}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div id="submit">
                                {showButton ? (
                                    <button
                                        className="fancy-btn"
                                        onClick={this.nextQuestion}
                                    >
                                        {count === total
                                            ? "Finish assignment"
                                            : "Next question"}
                                    </button>
                                ) : (
                                    <span></span>
                                )}
                            </div>
                        </div>
                    )}
                    {complete && (
                        <div>
                            <h1 className="scoreMessage">
                                You scored {score} correct out of {total}{" "}
                                questions!{" "}
                                {score / total > 0.5
                                    ? "Nice work!"
                                    : "Better luck next time!"}
                            </h1>
                            <Link className="finishBtn" to="/">
                                <Button type="default">
                                    Return to Home Page
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 50,
    },

    header: {
        width: "80%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 50,
    },

    centered: {
        width: "60%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 50,
    },

    question: {
        marginTop: 100,
        backgroundColor: "#F57C00",
        color: "white",
        padding: 10,
        textAlign: "center",
    },

    footer: {
        width: "60%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 50,
    },
};
