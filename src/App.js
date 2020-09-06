import React from "react";
import { Link } from "react-router-dom";

import {
    notification,
    Tabs,
    Form,
    Input,
    Button,
    Checkbox,
    Row,
    Image,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import studentImage from "./assets/student.svg";
import teacherImage from "./assets/teacher.svg";
import logo from "./assets/logo.png";

import { Auth } from "aws-amplify";

const { TabPane } = Tabs;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        };
    }

    async componentDidMount() {
        let loggedIn = await this.isLoggedIn()
        this.setState({ loggedIn })
    }

    async isLoggedIn() {
        return await Auth.currentAuthenticatedUser()
            .then(() => { return true; })
            .catch(() => { return false; })
    }

    async signOut() {
        console.log("signing out");
        try {
            await Auth.signOut();
            this.setState({ loggedIn: false });
        } catch (error) {
            console.log("error signing out: ", error);
        }
    }

    async signUp(values) {
        console.log(values);
        notification.open({
            message: "Account created",
            description: "Log in with your new account",
        });

        let username = values.username;
        let password = values.password;
        let email = values.email;

        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                },
            });
            console.log(user);
        } catch (error) {
            console.log("error signing up:", error);
        }
    }

    async signIn(values) {
        console.log(values);
        let username = values.username;
        let password = values.password;

        try {
            await Auth.signIn(username, password);
            this.setState({ loggedIn: true });
        } catch (error) {
            console.log("error signing in", error);
        }
    }

    render() {
        return (
            <div>
                {this.state.loggedIn === false ? (
                    <div style={styles.container}>
                        <div style={styles.logo}>
                            <img
                                alt="logo"
                                width={200}
                                height={200}
                                src={logo}
                            ></img>
                            <h1>Pythagoras</h1>
                        </div>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Sign In" key="1">
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={(v) => this.signIn(v)}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Username!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={
                                                <UserOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Username"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Password!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Form.Item
                                            name="remember"
                                            valuePropName="checked"
                                            noStyle
                                        >
                                            <Checkbox>Remember me</Checkbox>
                                        </Form.Item>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="login-form-button"
                                        >
                                            Log in
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab="Register" key="2">
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={(v) => this.signUp(v)}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Email!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={
                                                <MailOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Email"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Username!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={
                                                <UserOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Username"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Password!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="confirm"
                                        dependencies={["password"]}
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please confirm your password!",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue(
                                                            "password"
                                                        ) === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        "The two passwords that you entered do not match!"
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            type="password"
                                            placeholder="Confirm Password"
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="login-form-button"
                                        >
                                            Sign Up
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>{" "}
                    </div>
                ) : (
                    <div style={styles.container}>
                        <div style={styles.header}>
                            <h1 style={{fontFamily: "Times New Roman", paddingLeft: 15,}}>Pythagoras</h1>
                            
                            <div style={styles.signOut}>
                            <Button
                            type="text" onClick={() => this.signOut()}>
                                Sign Out
                            </Button>
                            </div>


                        </div>

                        <div style={styles.welcome}>
                        <h1>Welcome</h1>
                        </div>

                        <div style={styles.subtitle}>
                        <h1>I am a...</h1>
                        </div>

                        <div style={{ width: "100%" }}>
                            <Row justify="space-around" align="middle">
                                <div style={styles.centered}>
                                    <div style={styles.image}>
                                    <Link to="/student">
                                        <Image
                                            width={200}
                                            height={200}
                                            src={studentImage}
                                        />
                                    </Link>
                                    </div>
                                    <h3> Student </h3>
                                </div>

                                <div style={styles.centered}>
                                <div style={styles.image}>
                                    <Link to="/teacher">
                                        <Image
                                            width={200}
                                            height={200}
                                            src={teacherImage}
                                        />
                                    </Link>
                                    </div>
                                    <h3> Teacher </h3>
                                </div>
                            </Row>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const styles = {

    container: {
        height: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },

    header: {
        width: "80%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "lightgrey",
    },

    logo: {
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 10,
    },

    signOut:{
        fontSize:25,
        fontFamily: "Times New Roman",

    },

    welcome:{
      fontSize: 50,
      fontFamily: "Times New Roman",
      paddingBottom:0,  
    },

    subtitle:{
        fontSize: 15,
    },

    centered: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },

    image: {
        paddingBottom: 10.
    },
};
