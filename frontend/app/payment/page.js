"use client";

import { useState } from 'react';
import { Layout, Form, Input, Button, notification } from 'antd';

const { Content } = Layout;

const PaymentPage = () => {
    
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
     
      console.log('Processing payment:', values);
    
      await new Promise((resolve) => setTimeout(resolve, 2000));
      notification.success({
        message: 'Payment Successful',
        description: 'Thank you for your purchase!',
      });
    } catch (error) {
      notification.error({
        message: 'Payment Failed',
        description: 'An error occurred while processing your payment. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout>
      <Content style={{ padding: '50px', textAlign: 'center',backgroundColor:  "#23221E", }}>
        <h1>Payment Page</h1>
        <Form
          layout="vertical"
          style={{ maxWidth: 400, margin: 'auto' }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Card Number"
            name="cardNumber"
            rules={[{ required: true, message: 'Please enter your card number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name on Card"
            name="cardName"
            rules={[{ required: true, message: 'Please enter the name on your card' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: 'Please enter the expiry date' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="CVV"
            name="cvv"
            rules={[{ required: true, message: 'Please enter the CVV' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
              onClick={() => {
             router.push("/trains");
               }}
            >
              Pay Now
              
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default PaymentPage;
