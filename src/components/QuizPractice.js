import React from "react";
import { Link } from "react-router-dom";

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
            explanation: "",

            questionAnswered: false,
            answerCorrect: null,

            complete: false,
            showButton: false,
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
            explanation: this.state.challenges[count].explanation,
            total: this.state.challenges.length,
            count: this.state.count + 1,
        });
    }

    nextQuestion() {
        let { count, total } = this.state;
        this.clearClasses();

        if (count === total) {
            this.setState({
                complete: true,
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

        return (
            <div className="studyComponent">
                <div className="studyContainer">
                    {!complete && (
                        <div>
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
                                            ? "Finish quiz"
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
                                You scored {score} correct out of{" "}
                                {total} questions!{" "}
                                { (score/total) > 0.5
                                    ? "Nice work!"
                                    : "Better luck next time!"}
                            </h1>
                            <Link
                                className="finishBtn"
                                to="/"
                            >
                                <button>Return to Quiz Page</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
