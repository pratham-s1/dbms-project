"use client"; // Add this directive to convert the component to a Client Component

import { useRouter } from "next/navigation";
import { Form, Input, Layout, Button, notification } from "antd";
const { Content } = Layout;

export default function Landing() {
    const router = useRouter();

    const onFormSubmit = (values) => {
        // Handle form submission logic here
        console.log('Form submitted with values:', values);
    };

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
  
            <Form
              layout={"inline"}
              variant="filled"
              style={{ maxWidth: 600 }}
              onFinish={onFormSubmit}
            >
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" shape="round" htmlType="submit"
                onClick={()=>{
                  router.push("/forgot")
                }}>
                  Register as new user
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" shape="round" htmlType="submit"
                onClick={()=>{
                  router.push("/login")
                }}>
                  Login as registered user
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" shape="round" htmlType="submit"
                onClick={()=>{
                  router.push("/trains")
                }}>
                  Check train status!
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      </Content>
    );
}
