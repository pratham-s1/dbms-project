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
const { Content } = Layout;
import { useRouter } from "next/navigation";

export default function Login() {
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
      router.push("/admin");
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
          <h1>Search Trains</h1>
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
              label="Source"
              name="source"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Select placeholder={"Select source"}>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Destination"
              name="destination"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Select placeholder={"Select destination"}>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </Select>
            </Form.Item>

            <Form.Item
                label="Date of Travel"
                name="user_dob"
                rules={[{ required: true, message: "Please input!" }]}
              >
              <DatePicker />
            </Form.Item>


            <Form.Item wrapperCol={{ span: 16 }}>
              <Button type="primary" htmlType="submit">
                Search for Trains
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Content>
  );
}
