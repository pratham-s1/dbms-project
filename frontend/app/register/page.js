"use client";

import { getTableData, registeruser } from "@/app/services/table.service";
import { useQuery } from "@tanstack/react-query";
import { Form, Input, Select, Layout, Menu, Button, DatePicker, } from "antd";
import Password from "antd/es/input/Password";
const { Content } = Layout;
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();


  const onFormSubmit = async(values) => {
    console.log(values);
    const res=await registeruser(values)
    console.log(res)
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
          <p>Search for running trains for travelling to your destination</p>

          <Form
            layout={"vertical"}
            variant="filled"
            style={{ maxWidth: 600 }}
            onFinish={onFormSubmit}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input type="password"/>
            </Form.Item>

            <Form.Item
              label="Sex"
              name="sex"
              rules={[{ required: true, message: "Please input!" }]}
            >
             <Select>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
              </Select>
            </Form.Item>


            <Form.Item
              label="Phone no."
              name="phone"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <DatePicker/>
            </Form.Item>



            

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Content>
  );
}
