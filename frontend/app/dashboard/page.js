"use client";
import React, { useState } from "react";
import { Layout, Tabs, Form, Input, Button, Table } from "antd";
import { EditOutlined, LockOutlined, HistoryOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTicket, search } from "@/app/services/table.service";

const { TabPane } = Tabs;
const { Sider } = Layout;
const { Content } = Layout;

export default function Dashboard() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const columns = [
    {
      title: "PNR",
      dataIndex: "ticket_id",
      key: "ticket_id",
    },
    {
      title: "From Station",
      dataIndex: "from_station_name",
      key: "from_station_name",
    },
    {
      title: "From City",
      dataIndex: "from_station_city",
      key: "from_station_city",
    },
    {
      title: "To Station",
      dataIndex: "to_station_name",
      key: "to_station_name",
    },
    {
      title: "To City",
      dataIndex: "to_station_city",
      key: "to_station_city",
    },
    {
      title: "Train",
      dataIndex: "train_name",
      key: "train_name",
    },
    {
      title: "Departure Time",
      dataIndex: "departure_time",
      key: "departure_time",
    },
    {
      title: "Arrival Time",
      dataIndex: "arrival_time",
      key: "arrival_time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Train Status",
      dataIndex: "train_status",
      key: "train_status",
    },
  ];

  const fetchServices = async () => {
    const res = await getTicket();
    setData(res);
  };

  const { isLoading } = useQuery({
    queryKey: ["fetchTickets"],
    queryFn: fetchServices,
  });

  // const handleTabClick = (key) => {
  //     switch (key) {
  //         case 'travel_history':
  //             router.push('/travel_history');
  //             break;
  //         case 'edit_account':
  //             router.push('/edit_account');
  //             break;
  //         case 'change_password':
  //             router.push('/change_password');
  //             break;
  //         default:
  //             break;
  //     }
  // };

  return (
    <Layout>
      <Sider width={"100%"} style={{ background: "#fff" }}>
        <Tabs>
          <TabPane
            tab={
              <span>
                <HistoryOutlined style={{ marginRight: 8, marginLeft: 8 }} />
                Bookings
              </span>
            }
            key="travel_history"
          >
            <Content style={{ padding: "", background: "#111" }}>
              <Layout
                style={{ padding: "24px 0", background: "#111", color: "#fff" }}
              >
                <Content
                  style={{
                    padding: "12px 24px",
                    minHeight: 280,
                    color: "#fff",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: "1rem",
                    }}
                  >
                    Your Tickets
                  </h1>
                  <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={"ticket_id"}
                    rowHoverable
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          router.push(`/ticket?ticket_id=${record.ticket_id}`);
                        },
                      };
                    }}
                  />
                </Content>
              </Layout>
            </Content>
          </TabPane>
          <TabPane
            tab={
              <span>
                <LockOutlined style={{ marginRight: 8 }} />
                Change Password
              </span>
            }
            key="change_password"
          >
            <Form
              layout={"vertical"}
              variant="filled"
              style={{ maxWidth: 500, margin: "0 3rem" }}
              //onFinish={onFormSubmit}
            >
              <Form.Item
                label="Current Password"
                name="curr_password"
                rules={[{ required: true, message: "Please input!" }]}
                style={{ marginBottom: 10, marginTop: 10, marginLeft: 10 }}
              >
                <Input type="password" placeholder={"Password"} />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="new_password"
                rules={[{ required: true, message: "Please input!" }]}
                style={{ marginBottom: 10, marginLeft: 10 }}
              >
                <Input type="password" placeholder={"Password"} />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="cnf_password"
                rules={[{ required: true, message: "Please input!" }]}
                style={{ marginBottom: 10, marginLeft: 10 }}
              >
                <Input type="password" placeholder={"Password"} />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Sider>
    </Layout>
  );
}
