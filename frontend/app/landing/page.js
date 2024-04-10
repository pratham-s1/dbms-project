"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Layout, Button, notification } from "antd";
const { Content } = Layout;

export default function Landing() {
    const router = useRouter();
  

    return (
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Layout
          style={{
            padding: "24px 0",
          }}
        >
          <Content
            style={{
              padding: "12px 24px",
              minHeight: 280,
            }}
          >
            <h1>Railway Reservation and Management Portal</h1>
            {/* <p
              style={{
                marginTop: "0.4rem",
                marginBottom: "1rem",
              }}
            >
            </p> */}
  
            <Form
              layout={"horizontal"}
              variant="filled"
              style={{ maxWidth: 600 }}
              onFinish={onFormSubmit}
            >
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" shape="round" htmlType="submit">
                  Register as new user
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" shape="round" htmlType="submit">
                  Login as registered user
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      </Content>
    );
  }