"use client";
import React, { useState } from "react";
import { Layout, Table } from "antd";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTicket, search } from "@/app/services/table.service";

const { Content } = Layout;

const Tickets = () => {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'PNR',
      dataIndex: 'ticket_id',
      key: 'ticket_id',
    },
    {
      title: 'PaymentID',
      dataIndex: 'payment_id',
      key: 'payment_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.ticket_id === "Disabled User",
      name: record.ticket_id,
    }),
  };

  const fetchServices = async () => {
    const res = await getTicket();
    setData(res);
  };

  const { isLoading } = useQuery({
    queryKey: ["fetchTickets"],
    queryFn: fetchServices,
  });

  const onFormSubmit = async (values) => {
    try {
      const res = await search(values);
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
    }
  };

  return (
    <Content style={{ padding: "0 48px" }}>
      <Layout style={{ padding: "24px 0" }}>
        <Content style={{ padding: "12px 24px", minHeight: 280 }}>
          <h1>Your Tickets</h1>
          <Table 
            rowSelection={rowSelection}
            dataSource={data} 
            columns={columns} 
            rowKey={"ticket_id"}
          />
        </Content>
      </Layout>
    </Content>
  );
};

export default Tickets;
