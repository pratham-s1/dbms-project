"use client";

import { loginuser } from "@/app/services/table.service";
import { Form, Input, Layout, Button, notification } from "antd";
const { Content } = Layout;
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const onFormSubmit = async (values) => {
    try {
      console.log(values);
      const res = await loginuser(values);
      console.log(res);
      notification.success({
        message: "Success",
        description: "User logged in successfully",
      });
      router.push("/trains");
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
        backgroundColor:  "#141414",
      }}
    >
      <Layout
        style={{
          padding: "24px 0",
          backgroundColor:  "#141414",
        }}
      >
        <Content
          style={{
            padding: "12px 24px",
            minHeight: 280,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              
            }}
          >
            
            <img  //logo
              src="/logo.svg" 
              alt="Logo"
              style={{
                width: 620,
                height: 620,
                borderRadius: "50%",
                marginRight: 24,
              }}
            />
            
           
            <div
              style={{
                width: "400px", 
                height: "auto", 
                border: "1px solid #d9d9d9",
                borderRadius: "30px", 
                padding: "24px",
                backgroundSize: "cover", 
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginLeft: "200px",
                backgroundColor:  "#E4E1D6",  //#23221E
              }}
            >
              <h1 
              style={{ color:  "#23221E", }}
              >
                LOGIN
              </h1>
              <p
                style={{
                  marginTop: "0.4rem",
                  marginBottom: "1rem",
                  color:  "#23221E",
                }}
              >
                Start Booking after logging in!
              </p>

              <Form
                layout={"vertical"}
                variant="filled"
                style={{ maxWidth: 100 }}
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
                  label="Password"
                  name="user_password"
                  rules={[{ required: true, message: "Please input!" }]}
                >
                  <Input type="password" placeholder={"Password"} />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Login
                  </Button>
                </Form.Item>
                <Button danger onClick={() => router.push("/forgot")}>
                  Forgot Password
                </Button>
              </Form>
            </div>
          </div>
        </Content>
      </Layout>
    </Content>
  );
}
