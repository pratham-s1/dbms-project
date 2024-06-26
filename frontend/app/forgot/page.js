"use client";

import { forgot } from "@/app/services/table.service";
import { Form, Input, Layout, Button, notification } from "antd";
const { Content } = Layout;
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const onFormSubmit = async (values) => {
    try {
      console.log(values);
      const res = await forgot(values);
      console.log(res);
      notification.success({
        message: "Password reset successfully!",
        description: "Login again",
      });
      router.push("/");
    } catch (error) {
      notification.error({
        message: "Error",
        description: JSON.stringify(error),
      });

      console.log(error);
    }
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
          <h1>Forgot Password?</h1>
          <p
            style={{
              marginTop: "0.4rem",
              marginBottom: "1rem",
            }}
          >
            Have your password reset
          </p>

          <Form
            layout={"vertical"}
            variant="filled"
            style={{ maxWidth: 600 }}
            onFinish={onFormSubmit}
          >
            <Form.Item
              label="Email"
              name="user_email"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input placeholder={"Email"} />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="user_password"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input type="password" placeholder={"Password"} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 16 }}>
              <Button type="primary" htmlType="submit">
                Reset!
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Content>
  );
}
