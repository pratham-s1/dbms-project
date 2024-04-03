"use client";

import { search } from "@/app/services/table.service";
import {useState}from "react";
import {
  Form,
  Input,
  Select,
  Layout,
  Button,
  DatePicker,
  notification,
  Table
} from "antd";
const { Content } = Layout;
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function Login() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const router = useRouter();


  const generateColumnsFromData = (data) => {
    console.log({ lol: data });
    if (!data || data.length === 0) return;

    // Assuming all items have the same keys
    const firstItemKeys = Object.keys(data[0]);
    console.log(firstItemKeys);
    const generatedColumns = firstItemKeys.map((key) => ({
      title: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()), // Convert snake_case to Title Case
      dataIndex: key,
      key: key,
    }));

    setColumns(generatedColumns);
  };


  const onFormSubmit = async (values) => {
    try {
      console.log(values);
      const res = await search(values);
      console.log(res);

      setData(res);
      generateColumnsFromData(res);
      notification.success({
        message: "Success",
        description: "Trains found",
      });
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
              <DatePicker 
                minDate={dayjs()}
              />
            </Form.Item>


            <Form.Item wrapperCol={{ span: 16 }}>
              <Button type="primary" htmlType="submit">
                Search for Trains
              </Button>
            </Form.Item>
          </Form>

          {data && (
                    <Table
          dataSource={data}
          columns={columns}
          bordered
          scroll={{ x: 965 }}
        />
          )}
        </Content>
      </Layout>
    </Content>
  );
}
