import React from "react";
import { Link } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Assignment, Course, Enrollment } from "../models";

import "antd/dist/antd.css";
import { Button, Menu, Dropdown, Card, Col, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";

import placeholderImage from "../assets/placeholder.png";

export default class CoursePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseID: props.match.params.id,
            username: "",
            courseCopy: "",
            enrolled: false,
            assignments: [],
            enrollment: "",
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUnmount() {}

    async getData() {
        const user = await Auth.currentAuthenticatedUser();
        const course = await DataStore.query(Course, (c) =>
            c.id("eq", this.state.courseID)
        );
        const assignments = await DataStore.query(Assignment, (c) =>
            c.courseID("eq", this.state.courseID)
        );
        const enrollment = await DataStore.query(Enrollment, (c) => {
            c.courseID("eq", course[0].id);
            c.studentUsername("eq", user.username);
        });

        let students = course[0].students;
        if (students.indexOf(user.username) > -1) {
            this.setState({ enrolled: true });
        }

        this.setState({
            courseCopy: course[0],
            assignments: assignments,
            username: user.username,
            enrollment: enrollment[0],
        });

        console.log(this.state.courseCopy);
    }

    async handleJoinCourse() {
        const ori = this.state.courseCopy;
        let list = Object.assign([], ori.students);
        list.push(this.state.username);

        console.log(ori);
        await DataStore.save(
            Course.copyOf(ori, (updated) => {
                updated.students = list;
            })
        );

        const enroll = await DataStore.save(
            new Enrollment({
                courseID: ori.id,
                courseTitle: ori.title,
                studentUsername: this.state.username,
                progress: Math.floor(Math.random() * Math.floor(100)),
            })
        );
        console.log("joined", enroll);

        this.setState({
            enrolled: true,
            enrollment: enroll,
        });
    }

    async handleLeaveCourse() {
        const ori = this.state.courseCopy;
        let list = Object.assign([], ori.students);
        // eslint-disable-next-line
        list = list.filter((c) => c != this.state.username);

        await DataStore.save(
            Course.copyOf(ori, (updated) => {
                updated.students = list;
            })
        );

        console.log(this.state.enrollment);

        await DataStore.delete(Enrollment, (c) =>
            c.id("eq", this.state.enrollment.id)
        );

        this.setState({ enrolled: false });
    }

    render() {
        const { Meta } = Card;
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link to="/studentProfile">My Profile</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/teacher">Switch to Teacher</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/">Back to Menu</Link>
                </Menu.Item>
            </Menu>
        );

        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Pythagoras</h1>
                    <h1> {this.state.courseCopy.title} </h1>
                    <Dropdown overlay={menu}>
                        <Button>
                            More <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>

                <div style={styles.centered}>
                    <h1>Assignments</h1>
                    <Row gutter={16}>
                        {" "}
                        {this.state.enrolled &&
                            this.state.assignments &&
                            this.state.assignments.map((assignment, i) => (
                                <div key={i}>
                                    <Col span={8}>
                                        <Link
                                            to={{
                                                pathname: `/practice/${assignment.id}`,
                                                state: {
                                                    assignmentID: assignment.id,
                                                },
                                            }}
                                        >
                                            <Card
                                                hoverable
                                                style={{ width: 240 }}
                                                cover={
                                                    <img
                                                        alt="placeholder"
                                                        src={placeholderImage}
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title={assignment.title}
                                                />
                                            </Card>
                                        </Link>
                                    </Col>
                                </div>
                            ))}
                    </Row>
                </div>

                <div style={styles.footer}>
                    <Link to="/student">
                        {" "}
                        <Button> Back </Button>{" "}
                    </Link>
                    {this.state.enrolled ? (
                        <Button onClick={() => this.handleLeaveCourse()}>
                            Leave Course
                        </Button>
                    ) : (
                        <Button onClick={() => this.handleJoinCourse()}>
                            Join Course
                        </Button>
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
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
