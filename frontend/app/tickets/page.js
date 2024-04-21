"use client";

import { Layout, Card, Typography, Row, Col, Divider } from 'antd';
import { useRouter } from "next/navigation";
import Barcode from "react-barcode";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function BoardingPass() {
    const router = useRouter();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '50px', background: '#f0f2f5' }}>
                <Card
                    style={{ width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}
                    cover={<img alt="example" src="/logo.svg" style={{ width: '100%', maxHeight: '200px',marginTop:'50px' }}  />}
                >
                    <div style={{ padding: '20px' }}>
                        <Title level={4} style={{ marginBottom: '20px' }}>Your Ticket</Title>
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            <Col span={12}>
                                <Text strong>Train:</Text>
                            </Col>
                            <Col span={12}>
                                <Text>XYZ Express</Text>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            <Col span={12}>
                                <Text strong>Departure:</Text>
                            </Col>
                            <Col span={12}>
                                <Text>April 21, 2024, 10:00 AM</Text>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            <Col span={12}>
                                <Text strong>From:</Text>
                            </Col>
                            <Col span={12}>
                                <Text>Kolkata</Text>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            <Col span={12}>
                                <Text strong>To:</Text>
                            </Col>
                            <Col span={12}>
                                <Text>Mumbai</Text>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            <Col span={12}>
                                <Text strong>Passenger:</Text>
                            </Col>
                            <Col span={12}>
                                <Text>Pratham Singh</Text>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            <Col span={12}>
                                <Text strong>Seat:</Text>
                            </Col>
                            <Col span={12}>
                                <Text>Coach: A, Seat: 12A</Text>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                            <Col span={24}>
                                <Text strong>Thank you for choosing RailEz. Have a pleasant & safe journey!</Text>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col>
                                <Barcode value="1234567890" />
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Content>
        </Layout>
    );
}
