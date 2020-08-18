import React from "react";

import { DataStore } from "@aws-amplify/datastore";
import { Quiz, Challenge } from "../models";

export default class QuizPractice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizID: props.match.params.id,
            quiz: [],
            challenges: [],

            count: 0,
            score: 0,
            showButton: false,
            questionAnswered: false,
            displayPopup: "flex",
            classNames: ["", "", "", ""],
        };
        this.nextQuestion = this.nextQuestion.bind(this);
        this.handleShowButton = this.handleShowButton.bind(this);
        this.handleStartQuiz = this.handleStartQuiz.bind(this);
        this.handleIncreaseScore = this.handleIncreaseScore.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
    }

    async componentDidMount() {
        const quiz = (await DataStore.query(Quiz)).filter(
            (c) => c.id === this.state.quizID
        );
        const challenges = (await DataStore.query(Challenge)).filter(
            (c) => c.quizID === this.state.quizID
        );

        this.setState({ quiz: quiz });
        this.setState({ challenges: challenges });

        let { count } = this.state;
        this.insertData(count);
    }

    handleShowButton() {
        this.setState({
            showButton: true,
            questionAnswered: true,
        });
    }

    handleStartQuiz() {
        this.setState({
            displayPopup: "none",
            count: 1,
        });
    }

    handleIncreaseScore() {
        this.setState({
            score: this.state.score + 1,
        });
    }

    insertData(count) {
        this.setState({
            question: this.state.challenges[count].subtitle,
            choices: this.state.challenges[count].choices,
            solution: this.state.challenges[count].solution,
            total: this.state.challenges[count].choices.size,
            count: this.state.count + 1,
        });
    }

    nextQuestion() {
        let { count, total } = this.state;

        if (count === total) {
            this.setState({
                displayPopup: "flex",
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
        console.log("clicked something");
        let { questionAnswered } = this.state;

        if (!questionAnswered) {
            console.log("clicked on " + e);
            let { solution } = this.state;

            let elem = e.currentTarget;
            let answer = Number(elem.dataset.id);

            let updatedClassNames = this.state.classNames;

            console.log("answer: " + answer);
            if (answer === solution) {
                console.log("answer is correct");
                updatedClassNames[answer - 1] = "right";
                console.log("class name: " + updatedClassNames[answer - 1]);
                this.handleIncreaseScore();
            } else {
                console.log("answer is wrong");
                updatedClassNames[answer - 1] = "wrong";
            }

            this.setState({
                classNames: updatedClassNames,
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
        let {
            count,
            total,
            question,
            choices,
            showButton,
            classNames,
        } = this.state;

        return (
            <div className="studyComponent">
                <div className="studyContainer">
                    <div className="col-lg-12 col-md-10">
                        <div id="question">
                            <h4 className="bg-light">
                                Question {count}/{total}
                            </h4>
                            <p> {question} </p>
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
                                            {choice}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="submit">
                    {showButton ? (
                        <button
                            className="fancy-btn"
                            onClick={this.nextQuestion}
                        >
                            {count === total ? "Finish quiz" : "Next question"}
                        </button>
                    ) : (
                        <span></span>
                    )}
                </div>
            </div>
        );
    }
}
