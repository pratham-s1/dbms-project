"use client";

import { Layout, Card, Typography, Row, Col, Divider } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import { getTicketInfo } from "../services/table.service";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Loader from "../components/Loader";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function BoardingPass() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ticketData, setTicketData] = useState([]);
  const ticket_id = searchParams.get("ticket_id");

  const fetchServices = async () => {
    const res = await getTicketInfo({
      ticket_id,
    });
    setTicketData(res?.results[0]);
  };

  const { isLoading } = useQuery({
    queryKey: ["fetch-trian"],
    queryFn: fetchServices,
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px", background: "#f0f2f5" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
          cover={
            <Loader
              message={"Show this QR code at the station to board the train"}
              style={{
                margin: "24px 0",
                marginBottom: "0",
              }}
              pstyle={{
                color: "#000",
              }}
            />
          }
        >
          <div style={{ padding: "20px" }}>
            <Title level={4} style={{ marginBottom: "20px" }}>
              Your Ticket
            </Title>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>Train:</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {ticketData.train_name} ({ticketData.train_id})
                </Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>Departure Time:</Text>
              </Col>
              <Col span={12}>
                <Text>{ticketData.arrival_time}</Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>From Station:</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {ticketData.from_station_name}, {ticketData.from_station_city}
                </Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>To Station:</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {ticketData.to_station_name}, {ticketData.to_station_city}
                </Text>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>Arrival Time at destination (Tentative):</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {ticketData.departure_time}{" "}
                  {/* Update this if you have arrival time data */}
                </Text>
              </Col>
            </Row>

            <Divider />
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>Passenger:</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {ticketData.passenger_name} ({ticketData.passenger_email})
                </Text>{" "}
                {/* Update this if you have passenger name data */}
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>Seat:</Text>
              </Col>
              <Col span={12}>
                <Text>
                  Seat: {ticketData.seat_id} - <b>{ticketData.type}</b>
                </Text>{" "}
                {/* Update this if you have dynamic seat data */}
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
              <Col span={24}>
                <Text strong>
                  Thank you for choosing RailEz. Have a pleasant & safe journey!
                </Text>
              </Col>
            </Row>
            <Row justify="center">
              <Col>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={JSON.stringify({
                    ticket_id: ticketData.ticket_id,
                    passenger_name: ticketData.passenger_name,
                    train_name: ticketData.train_name,
                    from_station: ticketData.from_station_name,
                    to_station: ticketData.to_station_name,
                    departure_time: ticketData.departure_time,
                    arrival_time: ticketData.arrival_time,
                    seat_id: ticketData.seat_id,
                  })} // Updated to provide a dynamic link
                  viewBox={`0 0 256 256`}
                />
              </Col>
            </Row>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
