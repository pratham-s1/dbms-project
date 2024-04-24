"use client";
import { getStations, search } from "@/app/services/table.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Form,
  Select,
  Layout,
  Button,
  DatePicker,
  notification,
  Card,
  Row,
  Col,
} from "antd";
const { Content } = Layout;
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import dayjs from "dayjs";
import moment from "moment";

export default function Login() {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState({});
  const [dropdownData, setDropdownData] = useState([]);
  const router = useRouter();

  const fetchServices = async () => {
    const res = await getStations();
    setDropdownData(res);
  };

  const { isLoading } = useQuery({
    queryKey: ["fetchStations"],
    queryFn: fetchServices,
  });

  const searchMutation = useMutation({
    mutationFn: search,
    mutationKey: ["search-train"],
  });

  const onFormSubmit = async (values) => {
    try {
      console.log(values);
      const res = await searchMutation.mutateAsync(values);
      console.log(res.results);

      setData(res.results);
      setSearchData(res.info);
      notification.success({
        message: "Success",
        description: "Trains found",
      });
    } catch (error) {
      notification.info({
        message: "No Trains Found!",
        description: "Please try again with different criteria",
      });
      setData([]);
      console.log(error);
    }
  };
  const renderCards = () => {
    return data.map((item) => (
      <Col span={24} key={item.train_id}>
        <Card
          title={
            <>
              {item.train_name} ({item.train_id})
            </>
          }
          style={{
            marginBottom: "16px",
            backgroundColor: "#E4E1D6",
            border: "1px solid #d9d9d9",
          }}
          headStyle={{
            fontWeight: "bold",
            backgroundColor: "#DDDDDD",
            color: "#111",
          }} // Style the card header
          bodyStyle={{ padding: "20px" }} // Padding for card body content
        >
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <strong>Train Number:</strong> {item.train_id}
              </div>
              <div>
                <strong>Source:</strong> {item.source_name} ({item.source_id})
              </div>
              <div>
                <strong>Destination:</strong> {item.destination_name} (
                {item.destination_id})
              </div>
              <div>
                <strong>Departure Time:</strong> {item.start_time}
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>Arrival Time:</strong> {item.end_time}
              </div>
              <div>
                <strong>Available Seats:</strong> {item.total_seats}
              </div>
              <div>
                <strong>Status:</strong> {item.status}
              </div>
            </Col>
          </Row>
          <Button
            type="primary"
            style={{ marginTop: "16px", width: "100%" }} // Full width button
            onClick={() => {
              if (!user?.isLoggedIn) {
                notification.error({
                  message: "Login before booking!",
                  description: "Redirecting to login page",
                });

                router.push("/");
                return;
              }

              router.push(
                `/checkout?train_id=${item.train_id}&date=${searchData.date}&source=${searchData.source}&destination=${searchData.destination}`
              );
            }}
            className="black-button"
          >
            Book Train
          </Button>
        </Card>
      </Col>
    ));
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#111111" }}>
      <Content style={{ padding: "24px 48px" }}>
        <Row justify="center" style={{ marginBottom: "24px" }}>
          <Col span={24}>
            <h1
              style={{
                color: "#FFF",
                textAlign: "center",
                padding: "12px 0",
              }}
            >
              RailEz {user?.user?.name}
            </h1>
            <p
              style={{
                color: "#FFF",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Search for trains between stations and book your tickets in
              seconds
            </p>
            <Card style={{ backgroundColor: "#E4E1D6", borderRadius: "8px" }}>
              <Form
                layout="inline"
                onFinish={onFormSubmit}
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <Form.Item
                  label="From"
                  name="source"
                  rules={[{ required: true, message: "Please input!" }]}
                >
                  <Select
                    placeholder="Select source"
                    showSearch
                    options={dropdownData.map((item) => ({
                      value: item.station_id,
                      label: item.station_name,
                    }))}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    style={{
                      width: "200px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="To"
                  name="destination"
                  rules={[{ required: true, message: "Please input!" }]}
                >
                  <Select
                    placeholder="Select destination"
                    showSearch
                    options={dropdownData.map((item) => ({
                      value: item.station_id,
                      label: item.station_name,
                    }))}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    style={{
                      width: "200px",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Date of Travel"
                  name="date"
                  rules={[{ required: true, message: "Please input!" }]}
                >
                  <DatePicker
                    style={{
                      width: "200px",
                    }}
                    placeholder="Select Date"
                    minDate={dayjs(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="black-button"
                >
                  Search for Trains
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
        {data.length > 0 ? (
          <Row gutter={[16, 16]}>
            {/* <Divider /> */}
            {renderCards()}
          </Row>
        ) : (
          <Loader
            style={{
              margin: "32px 0",
            }}
            message={
              isLoading || searchMutation.isLoading
                ? "Finding the best trains for you in seconds"
                : "Start your search now!"
            }
          />
        )}
      </Content>
    </Layout>
  );
}
