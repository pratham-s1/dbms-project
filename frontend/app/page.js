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
              name="user_name"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input placeholder={"Name"} />
            </Form.Item>

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

            <Form.Item
              label="Date of Birth"
              name="user_dob"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <DatePicker
                maxDate={ 
                  dayjs().subtract(1, "day")
                }
              />
            </Form.Item>

            <Form.Item
              label="Sex"
              name="user_sex"
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
              name="user_phone"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input type="number" placeholder={"9999999999"} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 16 }}>
              <Button type="primary" htmlType="submit">
                Start Booking!
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Content>
  );
}
