"use client";

import {
  bookTicket,
  getBookingDetails,
  verifyPayment,
} from "@/app/services/table.service";
import { useState } from "react";
import { Button, Card, Form, Layout, notification, Radio, Select } from "antd";
const { Content } = Layout;
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import moment from "moment";

export default function Checkout() {
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

    const { seat, foodPreference } = values;
    const bookticketRes = await bookTicket({
      seat,
      foodPreference,
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
          description: "Payment Successful: " + res.ticket_id,
        });
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

  const handleSubmit = async (values) => {
    console.log(values);
    const { seat, foodPreference } = values;
    try {
      await bookTicketMutation.mutateAsync({
        seat,
        foodPreference,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
        {checkoutData &&
          checkoutData?.seats?.map((item, idx) => (
            <Card
              title="Seat Details"
              bordered={false}
              key={idx}
              style={{
                margin: "20px 0",
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
        <Form
          layout="vertical"
          onFinish={makePayment}
          style={{
            marginTop: 20,
          }}
        >
          <Form.Item
            label={<b style={{ color: "#fff" }}>Seat</b>}
            name="seat"
            rules={[{ required: true, message: "Please choose a seat" }]}
          >
            <Select
              placeholder="Select a seat"
              options={checkoutData?.seats?.map((item) => ({
                value: item.seat_id,
                label: `${item.type} Seat - Rs. ${item.price}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={<b style={{ color: "#fff" }}>Food Preference</b>}
            name="foodPreference"
          >
            <Radio.Group>
              <Radio
                value="vegetarian"
                style={{
                  color: "#fff",
                }}
              >
                Vegetarian
              </Radio>
              <Radio
                value="non-vegetarian"
                style={{
                  color: "#fff",
                }}
              >
                Non-Vegetarian
              </Radio>
              <Radio
                value="vegan"
                style={{
                  color: "#fff",
                }}
              >
                Vegan
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Proceed to Payment
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
