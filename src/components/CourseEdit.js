import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Assignment, Course } from "../models";
import "antd/dist/antd.css";
import { Button, Menu, Dropdown, List } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";

let subscription;

export default class CourseEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseID: props.match.params.id,
            title: "",
            courseCopy: "",
            assignments: [],
        };
    }

    componentDidMount() {
        this.getCopy();
        this.getData();

        subscription = DataStore.observe(Assignment).subscribe(() => {
            this.getData();
        });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getCopy() {
        const course = await DataStore.query(Course, (c) =>
            c.id("eq", this.state.courseID)
        );

        this.setState({
            title: course[0].title,
            courseCopy: course[0],
        });
    }

    async getData() {
        const assignments = await DataStore.query(Assignment, (c) =>
            c.courseID("eq", this.state.courseID)
        );

        this.setState({
            assignments: assignments,
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

    async handleAddAssignment() {
        await DataStore.save(
            new Assignment({
                title: "Placeholder assignment ".concat(
                    Math.floor(Math.random() * 10)
                ),
                courseID: this.state.courseID,
            })
        );
    }

    async handleDeleteAssignment(id) {
        await DataStore.delete(Assignment, (c) => c.id("eq", id));
    }

    async handleSave() {
        await DataStore.save(
            Assignment.copyOf(this.state.courseCopy, (updated) => {
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

        const { title, assignments } = this.state;

        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Pythagoras</h1>
                    <h1>Edit Course</h1>
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
                        dataSource={assignments}
                        renderItem={(assignment) => (
                            <List.Item
                                actions={[
                                    <Link
                                        to={{
                                            pathname: `/editAssignment/${assignment.id}`,
                                            state: {
                                                assignmentID: assignment.id,
                                            },
                                        }}
                                    >
                                        <EditOutlined />
                                    </Link>,

                                    <Link
                                        onClick={() =>
                                            this.handleDeleteAssignment(
                                                assignment.id
                                            )
                                        }
                                    >
                                        <DeleteOutlined />
                                    </Link>,
                                ]}
                            >
                                <List.Item.Meta title={assignment.title} />
                            </List.Item>
                        )}
                    ></List>
                </div>
                <div style={styles.footer}>
                    <Button onClick={() => this.handleAddAssignment()}>
                        Add assignment
                    </Button>
                    <Button onClick={() => this.handleSave()}>
                        Save course
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
