
"use client";
import { getStations, search } from "@/app/services/table.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Layout,
  Button,
  DatePicker,
  notification,
  Card,
  Radio,
  Divider,
  Row,
  Col,
} from "antd";
const { Content } = Layout;
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function Login() {
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
          style={{ marginBottom: "16px", backgroundColor:"#E4E1D6" ,}}
        >
          <p>Train Number: {item.train_number}
          Departure Time: {item.departure_time}
          Arrival Time: {item.arrival_time}
          Available Seats: {item.available_seats}</p>
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
          }}
        >
          <Card
            title="Search Trains"
            style={{ backgroundColor: "#E4E1D6", borderRadius: "8px" }}
          >
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
                <Select
                  placeholder={"Select source"} showSearch
                  options={dropdownData.map((item) => ({
                    value: item.station_id,
                    label: item.station_name,
                  }))}
                ></Select>
              </Form.Item>

              <Form.Item
                label="Destination"
                name="destination"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Select
                  placeholder={"Select destination"} showSearch
                  options={dropdownData.map((item) => ({
                    value: item.station_id,
                    label: item.station_name,
                  }))}
                ></Select>
              </Form.Item>

              <Form.Item
                label="Date of Travel"
                name="user_dob"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <DatePicker minDate={dayjs()} />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Search for Trains
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {data.length > 0 && (
            <>
              <Divider />
              <Row gutter={[16, 16]}>
                {renderCards()}
              </Row>
            </>
          )}
        </Content>
      </Layout>
    </Content>
  );
}
