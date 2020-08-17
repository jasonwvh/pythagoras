import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { DataStore } from "@aws-amplify/datastore";
import { Quiz, Challenge } from "../models";

export default function QuizReview() {
    const location = useLocation();
    const quizID = location.state.quizID;

    const [quiz, setQuiz] = useState([]);
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        async function getQuiz(quizID) {
            const response = (await DataStore.query(Quiz)).filter(
                (c) => c.quizID === quizID
            );
            setQuiz(response);
        }

        async function getChallenges(quizID) {
            const response = (await DataStore.query(Challenge)).filter(
                (c) => c.quizID === quizID
            );
            setChallenges(response);
        }

        getQuiz(quizID);
        getChallenges(quizID);
    }, [quizID]);

    const renderChallenge = (challenge) => {
        const solution = challenge.solution;
        const title = challenge.title;
        const choices = challenge.choices;
        const explanation = challenge.explanation;

        return (
            <div key={challenge.id}>
                <div className="reviewTitle">
                    <h1 className="questionTitle">{title}</h1>
                </div>
                {choices.map((choice, index) => (
                    <div
                        key={index}
                        className={
                            solution === index
                                ? "choice review solution"
                                : "choice review"
                        }
                    >
                        <p>{choice}</p>
                    </div>
                ))}
                {explanation && (
                    <div className="explanation">
                        <h3>Explanation:</h3>
                        <p>{explanation}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="studyWrapper reviewContainer">
            <div className="studyContainer">
                <div className="quizHeader">
                    <div className="quizTitle">
                        <span>{quiz.title} Overview </span>
                        <span style={{ marginLeft: 10 }}>{quizID}</span>
                    </div>
                    <h3 className="quizMeta">
                        {challenges.size > 1
                            ? `${challenges.size} total questions`
                            : ""}
                    </h3>
                    {
                        <span id="return">
                            <Link to="/">
                                <i
                                    className="fa fa-times-circle"
                                    aria-hidden="true"
                                ></i>
                            </Link>
                        </span>
                    }
                </div>
                {challenges.map(renderChallenge)}
            </div>
        </div>
    );
}
