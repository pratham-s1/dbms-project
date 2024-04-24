"use client";

import {
  bookTicket,
  getBookingDetails,
  verifyPayment,
} from "@/app/services/table.service";
import { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  notification,
  Radio,
  Select,
  Space,
} from "antd";
const { Content } = Layout;
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";

export default function Checkout() {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();

  const train_id = searchParams.get("train_id");
  const source = searchParams.get("source");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  const [checkoutData, setCheckoutData] = useState([]);
  console.log({ train_id, source, destination, date });

  const bookTicketMutation = useMutation({
    mutationFn: bookTicket,
    mutationKey: ["book-ticket"],
  });

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const makePayment = async (values) => {
    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    const { passengers } = values;
    const bookticketRes = await bookTicket({
      passengers,
    });

    const data = bookticketRes;

    console.log(data);
    console.log(data.amount);
    if (!data) {
      alert("Failed to book ticket");
      return;
    }

    var options = {
      key: "rzp_test_enm62dQPBiRPp3", // Enter the Key ID generated from the Dashboard
      name: "Rail EZ PVT Limited",
      currency: data.currency,
      amount: parseInt(data.amount),
      order_id: data.id,
      description: "Booking Train Ticket",
      handler: async function (response) {
        const res = await verifyPayment({
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        notification.success({
          message: "Success",
          description: "Payment Successful: " + res.ticketId,
        });

        router.push("/ticket?ticket_id=" + res.ticketId);
        // Validate payment at server - using webhooks is a better idea.
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: "Sitaraman S",
        email: "sitaraman@railez.com",
        contact: "9999999999",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const fetchServices = async () => {
    console.log({ train_id, source, destination, date });
    const res = await getBookingDetails({
      train_id,
      source,
      destination,
      date,
    });
    setCheckoutData(res);
  };

  const { isLoading } = useQuery({
    queryKey: ["fetch-trian"],
    queryFn: fetchServices,
  });

  console.log({ checkoutData });

  return (
    <Layout style={{ padding: "24px", backgroundColor: "#111111" }}>
      <Content style={{ padding: 20, margin: 0, minHeight: 280 }}>
        <h1
          style={{
            color: "#fff",
            marginBottom: 20,
          }}
        >
          Checkout Details
        </h1>
        <>
          {checkoutData && checkoutData?.results?.[0] && (
            <Card
              title="Train Information"
              bordered={false}
              style={{ marginBottom: 20 }}
            >
              <p>
                <strong>Train:</strong> {checkoutData?.results?.[0].train_name}{" "}
                ({checkoutData?.results?.[0].train_id})
              </p>
              <p>
                <strong>From:</strong> {checkoutData?.results?.[0].source_id} to{" "}
                {checkoutData?.results?.[0].destination_id}
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {checkoutData?.results?.[0].start_time} -{" "}
                <strong>Arrival:</strong> {checkoutData?.results?.[0].end_time}
              </p>
              <p>
                <strong>Status:</strong> {checkoutData?.results?.[0].status}
              </p>
              <p>
                <strong>Seats Available:</strong>{" "}
                {checkoutData?.results?.[0].total_seats}
              </p>
            </Card>
          )}
        </>
        <>
          {checkoutData &&
            checkoutData?.stations?.map((item, idx) => {
              return (
                <Card title="Your Journey Details" bordered={false} key={idx}>
                  <p>
                    <strong>Departure Station:</strong> {item.from_station_name}
                    , {item.from_city}
                  </p>
                  <p>
                    <strong>Arrival Station:</strong> {item.to_station_name},{" "}
                    {item.to_city}
                  </p>

                  <p>
                    <strong>Departure Date:</strong> {moment(date).format("LL")}
                  </p>

                  <p>
                    <strong>Start Time:</strong> {item.arrival_time} -{" "}
                    <strong>Arrival Time:</strong> {item.departure_time}
                  </p>

                  <p>
                    <strong>Journey Time:</strong>{" "}
                    {(() => {
                      const format = "HH:mm:ss";
                      let departureTime = moment(item.arrival_time, format);
                      let arrivalTime = moment(item.departure_time, format);

                      // Check if the arrival time is the next day
                      if (arrivalTime.isBefore(departureTime)) {
                        arrivalTime.add(1, "day"); // correctly add one day to the arrival time
                      }

                      const duration = moment.duration(
                        arrivalTime.diff(departureTime)
                      );
                      const hours = Math.floor(duration.asHours()); // total duration in hours, using floor to avoid rounding up
                      const minutes = duration.minutes(); // remaining minutes after hours are accounted

                      return `${hours} hours and ${minutes} minutes`;
                    })()}
                  </p>
                </Card>
              );
            })}
        </>
        <h2
          style={{
            color: "#fff",
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          Available Seats
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {checkoutData &&
            checkoutData?.seats?.map((item, idx) => (
              <Card
                title={`${item.type} Seat`}
                bordered={false}
                key={idx}
                style={{
                  margin: "20px 0",
                  maxWidth: 300,
                }}
              >
                <p>
                  <strong>Seat Number:</strong> {item.seat_id}
                </p>
                <p>
                  <strong>Seat Type:</strong> {item.type}
                </p>
                <p>
                  <strong>Seat Price:</strong> Rs. {item.price}
                </p>
              </Card>
            ))}
        </div>
        <Form form={form} layout="vertical" onFinish={makePayment}>
          <Form.List name="passengers">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      label="Traveller Name"
                      name={[field.name, "travellerName"]}
                      fieldKey={[field.fieldKey, "travellerName"]}
                      rules={[{ required: true, message: "Missing name" }]}
                    >
                      <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Traveller Email"
                      name={[field.name, "travellerEmail"]}
                      fieldKey={[field.fieldKey, "travellerEmail"]}
                      rules={[
                        {
                          type: "email",
                          message: "Enter a valid email!",
                          required: true,
                        },
                      ]}
                    >
                      <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Traveller Age"
                      name={[field.name, "travellerAge"]}
                      fieldKey={[field.fieldKey, "travellerAge"]}
                      rules={[
                        { required: true, message: "Missing age" },
                        {
                          min: 1,
                        },
                      ]}
                    >
                      <Input placeholder="Enter age" type="number" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Traveller Phone"
                      name={[field.name, "travellerPhone"]}
                      fieldKey={[field.fieldKey, "travellerPhone"]}
                      rules={[{ required: true, message: "Missing phone" }]}
                    >
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Food Preference"
                      name={[field.name, "foodPreference"]}
                      fieldKey={[field.fieldKey, "foodPreference"]}
                      rules={[
                        { required: true, message: "Missing food preference" },
                      ]}
                    >
                      {/* <Radio.Group>
                        <Radio value="vegetarian">Vegetarian</Radio>
                        <Radio value="non-vegetarian">Non-Vegetarian</Radio>
                        <Radio value="vegan">Vegan</Radio>
                      </Radio.Group> */}

                      <Select placeholder="Select food preference">
                        <Select.Option value="vegetarian">
                          Vegetarian
                        </Select.Option>
                        <Select.Option value="non-vegetarian">
                          Non-Vegetarian
                        </Select.Option>
                        <Select.Option value="vegan">Vegan</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Seat"
                      name={[field.name, "seat"]}
                      fieldKey={[field.fieldKey, "seat"]}
                      rules={[
                        { required: true, message: "Please choose a seat" },
                      ]}
                    >
                      <Select placeholder="Select a seat">
                        {checkoutData?.seats?.map((item, key) => (
                          <Select.Option value={item.seat_id} key={key}>
                            {item.type} - Rs. {item.price}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Button
                      onClick={() => remove(field.name)}
                      style={{ marginLeft: "20px", backgroundColor: "#ff4d4f" }}
                    >
                      Remove
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Passenger
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
