"use client";

import { registeruser } from "@/app/services/table.service";
import {
  Form,
  Input,
  Select,
  Layout,
  Button,
  DatePicker,
  notification,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
const { Content } = Layout;
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const onFormSubmit = async (values) => {
    try {
      console.log(values);
      const res = await registeruser(values);
      console.log(res);
      notification.success({
        message: "Success",
        description: "User registered successfully",
      });
      router.push("/login");
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
        padding: "0",
      }}
    >
      <Layout
        style={{
          backgroundColor: "#111111",
          padding: 0,
        }}
      >
        <Content
          style={{
            minHeight: 280,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Row
            style={{
              width: "100%",
            }}
          >
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
              <img //logo
                src="/logo.svg"
                alt="Logo"
                style={{
                  // borderRadius: "50%",
                  width: "60%",
                }}
              />
              <p
                style={{
                  color: "#E4E1D6",
                  marginTop: "2rem",
                  fontSize: 18,
                  fontStyle: "italic",
                }}
              >
                Book trains with ease with RailEz
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
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  border: "1px solid #e4e1d6",
                  padding: "1.4rem 2rem",
                  backgroundSize: "cover",
                  borderRadius: "10px",
                  maxWidth: "36rem",
                  minWidth: "30rem",
                  minHeight: "30rem",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#E4E1D6", //#23221E
                }}
              >
                <h1>Register</h1>
                <p
                  style={{
                    marginTop: "0.4rem",
                    marginBottom: "1rem",
                  }}
                >
                  Search for running trains for travelling to your destination
                </p>

                <Form
                  layout={"vertical"}
                  variant="filled"
                  style={{ maxWidth: 600 }}
                  onFinish={onFormSubmit}
                >
                  <Form.Item
                    label="Name"
                    name="passenger_name"
                    rules={[{ required: true, message: "Please input!" }]}
                  >
                    <Input placeholder={"Name"} />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="passenger_email"
                    rules={[{ required: true, message: "Please input!" }]}
                  >
                    <Input placeholder={"Email"} />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input!" }]}
                  >
                    <Input type="password" placeholder={"Password"} />
                  </Form.Item>

                  <Form.Item
                    label="Date of Birth"
                    name="passenger_dob"
                    rules={[{ required: true, message: "Please input!" }]}
                  >
                    <DatePicker
                      disabledDate={(current) => {
                        // This will disable all dates greater than today minus 18 years
                        const eighteenYearsAgo = dayjs().subtract(18, "years");
                        return current.isAfter(eighteenYearsAgo, "day");
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Sex"
                    name="passenger_sex"
                    rules={[{ required: true, message: "Please input!" }]}
                  >
                    <Select placeholder={"Select option"}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Phone no."
                    name="passenger_phone"
                    rules={[{ required: true, message: "Please input!" }]}
                  >
                    <Input type="number" placeholder={"9999999999"} />
                  </Form.Item>

                  <Form.Item wrapperCol={{ span: 16 }}>
                    <Button
                      type="dashed"
                      htmlType="submit"
                      className="black-button"
                    >
                      Book Now
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Content>
  );
}
