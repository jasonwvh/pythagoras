import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Assignment, Question } from "../models";

import "antd/dist/antd.css";
import { Button, Menu, Dropdown, List } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";

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
        const assignment = await DataStore.query(Assignment, (c) =>
            c.id("eq", this.state.assignmentID)
        );

        this.setState({
            title: assignment[0].title,
            assignmentCopy: assignment[0],
        });
    }

    async getData() {
        const questions = await DataStore.query(Question, (c) =>
            c.assignmentID("eq", this.state.assignmentID)
        );

        this.setState({
            questions: questions,
        });
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
                question: "Placeholder question ".concat(
                    Math.floor(Math.random() * 10)
                ),
                assignmentID: this.state.assignmentID,
                choices: ["ph1", "ph2", "ph3", "ph4"],
                solution: 1,
                explanation: "ph",
            })
        );
    }

    async handleDeleteQuestion(id) {
        await DataStore.delete(Question, (c) => c.id("eq", id));
    }

    async handleSave() {
        await DataStore.save(
            Assignment.copyOf(this.state.assignmentCopy, (updated) => {
                updated.title = this.state.title;
            })
        );

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

        const { title, questions } = this.state;

        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Pythagoras</h1>
                    <h1>Edit Assignment</h1>
                    <Dropdown overlay={menu}>
                        <Button>
                            More <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <div style={styles.centered}>
                    <form>
                        <label> Title </label>
                        <input
                            id="title"
                            placeholder="Enter title"
                            onChange={(e) => this.handleChange(e)}
                            value={title}
                        />
                    </form>
                </div>
                <div style={styles.centered}>
                    <List
                        size="large"
                        bordered
                        itemLayout="horizontal"
                        dataSource={questions}
                        renderItem={(question) => (
                            <List.Item
                                actions={[
                                    <Link
                                        to={{
                                            pathname: `/editQuestion/${question.id}`,
                                            state: { questionID: question.id },
                                        }}
                                    >
                                        <EditOutlined />
                                    </Link>,
                                    <Link
                                        onClick={() =>
                                            this.handleDeleteQuestion(
                                                question.id
                                            )
                                        }
                                    >
                                        <DeleteOutlined />
                                    </Link>,
                                ]}
                            >
                                <List.Item.Meta title={question.question} />
                            </List.Item>
                        )}
                    ></List>
                </div>

                <div style={styles.footer}>
                    <Button onClick={() => this.handleAddQuestion()}>
                        Add question
                    </Button>
                    <Button onClick={() => this.handleSave()}>
                        Save assignment
                    </Button>
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
        width: "80%",
        paddingBottom: 50,
    },

    footer: {
        width: "60%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 50,
    },
};
