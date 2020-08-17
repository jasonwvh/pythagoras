import React from "react";
import { Link } from "react-router-dom";

import { Button } from "react-bootstrap"

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
            total: 0,
            score: 0,
            showButton: false,
            questionAnswered: false,
            isAnswered: false,
            displayPopup: "flex",
            classNames: ['', '', '', '']
        };
        this.nextQuestion = this.nextQuestion.bind(this);
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
        console.log("clicked on " + e)
        
        if(!this.state.isAnswered) {
            let elem = e.currentTarget;
            console.log("elem " + elem)
            let { correct, increaseScore } = this.state;
            let answer = Number(elem.dataset.id);
            let updatedClassNames = this.state.classNames;

            if(answer === correct){
                updatedClassNames[answer-1] = 'right';
                increaseScore();
            }
            else {
                updatedClassNames[answer-1] = 'wrong';
            }
            
            this.setState({
                classNames: updatedClassNames,
                
            })

            this.handleShowButton();       
            var myTime = setTimeout(() => {
                this.clearClasses();
                //console.log("IN SET Timeout")
            }, 5000);
        }
    }
    clearClasses(){
        this.setState({
            classNames: ['', '', '', '']
        })
        
    }

    render() {
        let {
            count,
            total,
            question,
            choices,
            solution,
            showButton,
            questionAnswered,
            displayPopup,
            score,
            classNames,
        } = this.state;

        let { answers } = this.props;

        let transition = {
            transitionName: "example",
            transitionEnterTimeout: 500,
            transitionLeaveTimeout: 300
        }
        
        console.log(choices);

        return (
            <div>
                <h1>QuizPractice for {this.state.quizID} </h1>
                <div>
                    <div>
                        <p> {question} </p>
                    </div>
                    <div>
                        {choices && choices.map((choice, index) => (
                            <div key={index}>
                                <Button className={"title "} onClick={(e) => this.checkAnswer(e)}>{choice}</Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    {showButton ? 
                    <Button onClick={this.nextQuestion} >
                    {count === total ? 'Finish quiz' : 'Next question'}
                    </Button> : <span></span>}
                </div>
            </div>
        );
    }
}
