import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Question } from "../models";
import "../App.css";
import "antd/dist/antd.css";
import { Button, Menu, Dropdown, Form, Select, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 12,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 6,
        span: 12,
    },
};

export default class QuestionEdit extends React.Component {
    formRef = React.createRef();

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
            q = question[0].question;
        }

        if (question[0].choices) {
            c1 = question[0].choices[0];
            c2 = question[0].choices[1];
            c3 = question[0].choices[2];
            c4 = question[0].choices[3];
        }

        if (question[0].solution) {
            sol = question[0].solution;
        }

        if (question[0].explanation) {
            exp = question[0].explanation;
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

    onFinish = async (values) => {
        const choices = [
            values.choiceOne,
            values.choiceTwo,
            values.choiceThree,
            values.choiceFour,
        ];

        console.log("values", values);

        await DataStore.save(
            Question.copyOf(this.state.questionCopy, (updated) => {
                updated.question = values.quest;
                updated.choices = choices;
                updated.solution = values.solution;
                updated.explanation = values.explanation;
            })
        );

        this.props.history.goBack();
    };

    handleBack() {
        this.props.history.goBack();
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

        const {
            question,
            choiceOne,
            choiceTwo,
            choiceThree,
            choiceFour,
            solution,
            explanation,
        } = this.state;

        return (
            <div style={styles.container}>
                {this.state.questionCopy && (
                    <div style={styles.container}>
                        <div style={styles.header}>
                            <h1>Pythagoras</h1>
                            <h1>Edit Question</h1>
                            <Dropdown overlay={menu}>
                                <Button>
                                    More <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                        <div style={styles.centered}>
                            <Form
                                {...layout}
                                initialValues={{
                                    quest: question,
                                    choiceOne: choiceOne,
                                    choiceTwo: choiceTwo,
                                    choiceThree: choiceThree,
                                    choiceFour: choiceFour,
                                    solution: solution,
                                    explanation: explanation,
                                }}
                                ref={this.formRef}
                                name="control-ref"
                                onFinish={this.onFinish}
                            >
                                <Form.Item
                                    name="quest"
                                    label="Question"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="choiceOne"
                                    label="Choice 1"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="choiceTwo"
                                    label="Choice 2"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="choiceThree"
                                    label="Choice 3"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="choiceFour"
                                    label="Choice 4"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item name="solution" label="Solution">
                                    <Select>
                                        <Option value={1}>1</Option>
                                        <Option value={2}>2</Option>
                                        <Option value={3}>3</Option>
                                        <Option value={4}>4</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="explanation"
                                    label="Explanation"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input.TextArea />
                                </Form.Item>

                                <Form.Item {...tailLayout}>
                                    <Button
                                        htmlType="button"
                                        onClick={() => this.handleBack()}
                                    >
                                        Discard Changes
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                )}
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
        width: "80%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
    },

    footer: {
        width: "60%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 50,
    },
};
