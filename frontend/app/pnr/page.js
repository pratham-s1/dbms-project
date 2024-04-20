"use client"; // Add this directive to convert the component to a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Form, Input, Button, notification } from "antd";
const { Content } = Layout;

const CheckPNRPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Here you would call an API to check PNR status
      console.log("Checking PNR status:", values.pnrNumber);
      // Simulating API call for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Assume the API returns the status
      const status = Math.random() < 0.5 ? "Confirmed" : "Not Confirmed";
      notification.success({
        message: "PNR Status",
        description: `PNR Number: ${values.pnrNumber}, Status: ${status}`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while checking PNR status. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content style={{ padding: "50px", textAlign: "center" }}>
      <h1>Check PNR Status</h1>
      <Form layout="vertical" style={{ maxWidth: 400, margin: "auto" }} onFinish={onFinish}>
        <Form.Item
          label="Enter PNR Number"
          name="pnrNumber"
          rules={[{ required: true, message: "Please enter your PNR number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Check Status
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default CheckPNRPage;
