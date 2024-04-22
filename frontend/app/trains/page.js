"use client";
import { getStations, search } from "@/app/services/table.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Layout, Button, notification, Card, Divider, Row, Col } from "antd";
const { Content } = Layout;
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

export default function Trains() {
  const user = useSelector((state) => state.user);
  const searchParams = useSearchParams();

  const source_id = searchParams.get("source_id");
  const destination_id = searchParams.get("destination_id");
  const date = searchParams.get("date");

  console.log({ source_id, destination_id, date });

  console.log(user);

  const [data, setData] = useState([]);
  const [dropdownData, setDropdowndata] = useState([]);
  const router = useRouter();

  const fetchServices = async () => {
    const res = await getStations();
    console.log(res);
    setDropdowndata(res);
  };

  const { isLoading } = useQuery({
    queryKey: ["fetchStations"],
    queryFn: fetchServices,
  });

  const onFormSubmit = async (values) => {
    try {
      console.log(values);
      const res = await search(values);
      console.log(res);

      setData(res);
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

  const renderCards = () => {
    return data.map((item) => (
      <Col span={24} key={item.train_id}>
        <Card
          title={item.train_name}
          style={{ marginBottom: "16px", backgroundColor: "#E4E1D6" }}
        >
          <p>
            Train Number: {item.train_number}
            Departure Time: {item.departure_time}
            Arrival Time: {item.arrival_time}
            Available Seats: {item.available_seats}
          </p>
          <Button
            onClick={() => {
              notification.success({
                message: "Success",
                description: `Train ${item.train_name} booked`,
              });
            }}
          >
            Book Train
          </Button>
        </Card>
      </Col>
    ));
  };

  return (
    <Content
      style={{
        padding: "0 48px",
        backgroundColor: "#111111",
      }}
    >
      <Layout
        style={{
          padding: "24px 0",
          backgroundColor: "#111111",
        }}
      >
        <Content
          style={{
            padding: "12px 24px",
            minHeight: 280,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.length > 0 ? (
            <>
              <Divider />
              <Row gutter={[16, 16]}>{renderCards()}</Row>
            </>
          ) : (
            <Loader />
          )}
        </Content>
      </Layout>
    </Content>
  );
}
