"use client";

import { loginuser } from "@/app/services/table.service";
import {
  Form,
  Input,
  Layout,
  Button,
  notification,
  Row,
  Col,
  Card,
} from "antd";
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
    <Content style={{ padding: "0" }}>
      <Layout style={{ backgroundColor: "#111111", padding: 0 }}>
        <Content
          style={{
            minHeight: 280,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Row style={{ width: "100%" }}>
            <Col
              xs={24}
              md={12}
              lg={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img src="/logo.svg" alt="Logo" style={{ width: "60%" }} />
              <p
                style={{
                  color: "#E4E1D6",
                  marginTop: "2rem",
                  fontSize: 18,
                  fontStyle: "italic",
                }}
              >
                RailEz Book Trains with ease
              </p>
            </Col>

            <Col
              xs={24}
              md={12}
              lg={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  border: "1px solid #e4e1d6",
                  padding: "2.4rem 2rem",
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  maxWidth: "30rem",
                  minWidth: "26rem",
                  minHeight: "30rem",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#E4E1D6",
                }}
              >
                <h1 style={{ color: "#23221E" }}>Login</h1>
                <p
                  style={{
                    marginTop: "0.4rem",
                    marginBottom: "1rem",
                    color: "#23221E",
                  }}
                >
                  Start Booking after logging in!
                </p>

                <Form
                  layout={"vertical"}
                  variant="filled"
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="black-button"
                    >
                      Login
                    </Button>
                  </Form.Item>

                  <p>
                    Don't have an account?{" "}
                    <a
                      style={{ color: "#23221E", fontWeight: "bold" }}
                      onClick={() => router.push("/")}
                    >
                      Register
                    </a>
                  </p>

                  <p>
                    <a
                      style={{ color: "#23221E", fontWeight: "bold" }}
                      onClick={() => router.push("/forgot")}
                    >
                      Forgot Password
                    </a>

                    <p>
                      Login as Admin{" "}
                      <a
                        style={{ color: "#23221E", fontWeight: "bold" }}
                        onClick={() => router.push("/admlogin")}
                      >
                        Here
                      </a>
                    </p>
                  </p>
                </Form>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
      <div style={{ padding: "24px", background: "#111111" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Card title="Card 1" bordered={false}>
              <p>Card content</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Card title="Card 2" bordered={false}>
              <p>Card content</p>
            </Card>
          </Col>
        </Row>
      </div>
    </Content>
  );
}
