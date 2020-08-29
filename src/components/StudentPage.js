import React from "react";
import { Link } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Course, Enrollment } from "../models";

import "antd/dist/antd.css";
import { Button, Menu, Dropdown, Card, Col, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";

import placeholderImage from "../assets/placeholder.png";

let subscription;

export default class StudentPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            enrollment: "",
            courses: [],
        };
    }

    componentDidMount() {
        this.getData();

        subscription = DataStore.observe(Enrollment).subscribe((msg) => {
            this.getData();
        });

        console.log(this.state.enrollment);
    }

    componentWillUnmount() {
        subscription.unsubscribe();
    }

    async getData() {
        const user = await Auth.currentAuthenticatedUser();
        const courses = await DataStore.query(Course);
        this.setState({
            username: user.username,
            courses: courses,
        });
    }

    async onJoinCourse(id) {
        const ori = await DataStore.query(Course, (c) => c.id("eq", id));

        let list = Object.assign([], ori[0].students);

        list.push(this.state.username);

        await DataStore.save(
            Course.copyOf(ori[0], (updated) => {
                updated.students = list;
            })
        );

        const enrollment = await DataStore.save(
            new Enrollment({
                classroomID: ori[0].id,
                classroomTitle: ori[0].title,
                studentUsername: this.state.username,
                progress: 50,
            })
        );

        this.setState({ enrollment });
    }

    async signOut() {
        console.log("calling sign out");
        try {
            await Auth.signOut();
        } catch (error) {
            console.log("error signing out: ", error);
        }
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
                    <h1> Browse Course </h1>
                    <Dropdown overlay={menu}>
                        <Button>
                            More <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <div>
                    <Row gutter={16}>
                        {this.state.courses.map((course, i) => (
                            <div key={i}>
                                <Col span={8}>
                                    <Link
                                        to={{
                                            pathname: `/course/${course.id}`,
                                            state: { courseID: course.id },
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
                                            <Meta title={course.title} />
                                        </Card>
                                    </Link>
                                </Col>
                            </div>
                        ))}
                    </Row>
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        height: "100%",
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
};
