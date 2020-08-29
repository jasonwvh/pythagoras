import React from "react";
import { Link } from "react-router-dom";

import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Course, Enrollment } from "../models";

import "antd/dist/antd.css";
import { Button, Menu, Dropdown, Col, Row, Progress } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default class StudentProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            enrolled: false,
            enrollments: [],
            courses: [],
        };
    }

    componentDidMount() {
        this.getUserCourses();
    }

    async getUserCourses() {
        const user = await Auth.currentAuthenticatedUser();

        const enrollments = await DataStore.query(Enrollment, (c) =>
            c.studentUsername("eq", user.username)
        );

        let enrollmentsID = enrollments.map((c) => c.courseID);

        await DataStore.query(Course, (c) =>
            c.or((c) =>
                enrollmentsID.reduce((c, courseID) => c.id("eq", courseID), c)
            )
        ).then((results) => {
            this.setState({ courses: results });
        });

        this.setState({ enrollments });
        console.log(this.state.enrollments);
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link to="/student">Browse Courses</Link>
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
                    <h1> My Progress </h1>
                    <Dropdown overlay={menu}>
                        <Button>
                            More <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <Row gutter={16}>
                    {this.state.enrollments &&
                        this.state.enrollments.map((course, i) => (
                            <div key={i}>
                                <Col span={8}>
                                    <div style={styles.centered}>
                                        <Progress
                                            type="circle"
                                            percent={course.progress}
                                        />
                                        <h1>{course.courseTitle}</h1>
                                    </div>
                                </Col>
                            </div>
                        ))}
                    {!this.state.enrollments}
                </Row>
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
