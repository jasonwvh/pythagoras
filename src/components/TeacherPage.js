import React from "react";
import { Link } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Course } from "../models";

import "antd/dist/antd.css";
import { Button, Menu, Dropdown, Card, Col, Row } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";

import placeholderImage from "../assets/placeholder.png";
let subscription;

export default class TeacherPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
        };
    }

    componentDidMount() {
        this.getData();

        subscription = DataStore.observe(Course).subscribe((msg) => {
            this.getData();
        });
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getData() {
        const courses = await DataStore.query(Course);

        this.setState({ courses });
    }

    async handleCreateCourse() {
        await DataStore.save(
            new Course({
                title: "Placeholder title ".concat(
                    Math.floor(Math.random() * 10)
                ),
                students: [""],
                assignments: [""],
            })
        );
    }

    async handleDeleteCourse(id) {
        await DataStore.delete(Course, (c) => c.id("eq", id));
    }

    render() {
        const { Meta } = Card;
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

        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Pythagoras</h1>
                    <h1>Teacher Interface</h1>
                    <Dropdown overlay={menu}>
                        <Button>
                            More <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <div style={styles.centered}>
                    <Row gutter={16}>
                        {this.state.courses.map((course, i) => (
                            <div key={i}>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={
                                            <img
                                                alt="placeholder"
                                                src={placeholderImage}
                                            />
                                        }
                                        actions={[
                                            <Link
                                                to={{
                                                    pathname: `/editCourse/${course.id}`,
                                                    state: {
                                                        courseID: course.id,
                                                    },
                                                }}
                                            >
                                                {" "}
                                                <EditOutlined key="edit" />{" "}
                                            </Link>,

                                            <Link
                                                onClick={() =>
                                                    this.handleDeleteCourse(
                                                        course.id
                                                    )
                                                }
                                            >
                                                <DeleteOutlined key="delete" />
                                            </Link>,
                                        ]}
                                    >
                                        <Meta title={course.title} />
                                    </Card>
                                </Col>
                            </div>
                        ))}
                    </Row>
                </div>

                <Button onClick={() => this.handleCreateCourse()}>
                    Create New Course
                </Button>
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
