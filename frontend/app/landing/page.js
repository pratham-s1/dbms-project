"use client"; 

import { useRouter } from "next/navigation";
import { Form, Input, Layout, Button } from "antd";
const { Content } = Layout;

export default function Landing() {
  const router = useRouter();
  const onFormSubmit = (values) => {
    // Handle form submission logic here
    console.log('Form submitted with values:', values);
    };

    return (
        <Layout>
            <Content style={{ padding: "0 48px", marginTop: 64 }}>
                <div style={{ textAlign: "center" }}>
                    <h1>Railway Reservation and Management Portal</h1>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                    <Form
                        layout={"vertical"}
                        style={{ maxWidth: 400 }}
                        onFinish={onFormSubmit}
                    >
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                type="primary"
                                shape="round"
                                htmlType="submit"
                                block
                                onClick={() => {
                                    router.push("/");
                                }}
                            >
                                Register as new user
                            </Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                type="primary"
                                shape="round"
                                htmlType="submit"
                                block
                                onClick={() => {
                                    router.push("/login");
                                }}
                            >
                                Login as registered user
                            </Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                                type="primary"
                                shape="round"
                                htmlType="submit"
                                block
                                onClick={() => {
                                    router.push("/trains");
                                }}
                            >
                                Check train status
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
}