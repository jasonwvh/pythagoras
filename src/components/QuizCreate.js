import React from "react";
import { Col, Form, Button } from "react-bootstrap";
import { DataStore } from "@aws-amplify/datastore";
import { Quiz, Challenge } from "../models";

export default class QuizCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            category: "",

            challengeList: [],
        };
        this.handleQuizChange = this.handleQuizChange.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {}

    handleQuizChange(e) {
        switch (e.target.id) {
            case "title":
                this.setState({ title: e.target.value });
                break;
            case "category":
                this.setState({ category: e.target.value });
                break;
            default:
                break;
        }
    }

    handleQuestionChange(e, i) {
        let list = this.state.challengeList.slice();

        switch (e.target.id) {
            case "questions":
                list[i].title = e.target.value;
                break;
            case "choiceOne":
                list[i].choiceOne = e.target.value;
                break;
            case "choiceTwo":
                list[i].choiceTwo = e.target.value;
                break;
            case "choiceThree":
                list[i].choiceThree = e.target.value;
                break;
            case "choiceFour":
                list[i].choiceFour = e.target.value;
                break;
            case "solution":
                list[i].solution = parseInt(e.target.value);
                break;
            case "explanation":
                list[i].explanation = e.target.value;
                break;
            default:
                break;
        }
        this.setState({challengeList: list})
    }

    async handleSave() {
        const quiz = await DataStore.save(new Quiz({
                title: this.state.title,
                category: this.state.category,
            })
        )

        for (var i=0; i<this.state.challengeList.length; i++) {
            await DataStore.save(new Challenge({
                quizID: quiz.id,
                title: this.state.challengeList[i].title,
                subtitle: this.state.challengeList[i].title,
                choices: [
                    this.state.challengeList[i].choiceOne,
                    this.state.challengeList[i].choiceTwo,
                    this.state.challengeList[i].choiceThree,
                    this.state.challengeList[i].choiceFour
                ],
                solution: this.state.challengeList[i].solution,
                explanation: this.state.challengeList[i].explanation
            })
        )}
    }

    onAddChallenge = () => {
        let list = this.state.challengeList;
        list.push({
            title: "",
            choiceOne: "",
            choiceTwo: "",
            choiceThree: "",
            choiceFour: "",
            solution: 1,
            explanation: "",
        })
        this.setState({challengeList: list})

    };

    render() {
        return (
            <div>
                <div className="header">
                    <span>Pythagoras</span>
                </div>
                <div className="studyComponent">
                    <Form>
                        <Form.Row>
                            <Col xs="auto">
                                <Form.Label>Quiz Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="title"
                                    placeholder="Enter title"
                                    onChange={this.handleQuizChange}
                                    value={this.state.title}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs="auto">
                                <Form.Label>Quiz Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="category"
                                    placeholder="Enter category"
                                    onChange={this.handleQuizChange}
                                    value={this.state.category}
                                />
                            </Col>
                        </Form.Row>
                    </Form>
                    {this.state.challengeList.map((challenge, i) => (
                        <div key={i} style={{ margin: 20 }}>
                            <Form key={i}>
                                <Form.Row>
                                    <Col xs="auto">
                                        <Form.Label>
                                            Question {i + 1}
                                        </Form.Label>
                                        <Form.Control
                                            placeholder="Enter question"
                                            id="questions"
                                            onChange={e =>
                                                this.handleQuestionChange(e, i)
                                            }
                                            value={challenge.questions}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs="auto">
                                        <Form.Label>Answer 1</Form.Label>
                                        <Form.Control
                                            placeholder="Answer 1"
                                            id="choiceOne"
                                            onChange={e =>
                                                this.handleQuestionChange(e, i)
                                            }
                                            value={challenge.choiceOne}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs="auto">
                                        <Form.Label>Answer 2</Form.Label>
                                        <Form.Control
                                            placeholder="Answer 2"
                                            id="choiceTwo"
                                            onChange={(e) =>
                                                this.handleQuestionChange(e, i)
                                            }
                                            value={challenge.choiceTwo}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs="auto">
                                        <Form.Label>Answer 3</Form.Label>
                                        <Form.Control
                                            placeholder="Answer 3"
                                            id="choiceThree"
                                            onChange={(e) =>
                                                this.handleQuestionChange(e, i)
                                            }
                                            value={challenge.choiceThree}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs="auto">
                                        <Form.Label>Answer 4</Form.Label>
                                        <Form.Control
                                            placeholder="Answer 4"
                                            id="choiceFour"
                                            onChange={(e) =>
                                                this.handleQuestionChange(e, i)
                                            }
                                            value={challenge.choiceFour}
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs="auto">
                                        <Form.Label>Solution</Form.Label>
                                        <Form.Control
                                            as="select"
                                            id="solution"
                                            value={challenge.solution}
                                            onChange={(e) =>
                                                this.handleQuestionChange(e, i)
                                            }
                                        >
                                            <option value={1}>One</option>
                                            <option value={2}>Two</option>
                                            <option value={3}>Three</option>
                                            <option value={4}>Four</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col xs="auto">
                                        <Form.Label>Explanation</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows="3"
                                            id="explanation"
                                            placeholder="Explanation"
                                            onChange={(e) =>
                                                this.handleQuestionChange(e, i)
                                            }
                                            value={challenge.explanation}
                                        />
                                    </Col>
                                </Form.Row>
                            </Form>
                        </div>
                    ))}
                </div>
                <Button onClick={this.onAddChallenge}>Add challenge</Button>
                <div></div>
                <Button onClick={this.handleSave}>Save quiz</Button>
            </div>
        );
    }
}
