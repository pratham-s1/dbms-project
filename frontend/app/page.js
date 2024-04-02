"use client";

import { getTableData } from "./services/table.service";
import { useQuery } from "@tanstack/react-query";
import { Form, Input, Select, Layout, Menu, Button, DatePicker } from "antd";
const {Content} = Layout;
import { useRouter } from "next/navigation";

export default function Home() {

  const router=  useRouter();

  const fetchServices = async () => {
    // Ensure getTableData is an async function or returns a promise
    return await getTableData({ tableName: "Users" });
  };
  const { data, isLoading } = useQuery({  
    queryKey: ["fetchServices"],
    queryFn: fetchServices,
  });
  console.log({ data });
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <h1>Book Trains</h1>
            <p>Search for running trains for travelling to your destination</p>

            <Form
              layout={"vertical"}
              variant="filled"
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                label="Input"
                name="Input"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Select"
                name="Select"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Select />
              </Form.Item>

              <Form.Item
                label="DatePicker"
                name="DatePicker"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                label="DatePicker"
                name="DatePicker"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <DatePicker />
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
