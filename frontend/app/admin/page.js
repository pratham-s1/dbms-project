"use client";
import styles from "@/app/page.module.css";
import { Table, Select } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "@/app/services/table.service";

const { Option } = Select;

export default function About() {
  const [selectedTable, setSelectedTable] = useState("Train");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const generateColumnsFromData = (data) => {
    console.log({ lol: data });
    if (!data || data.length === 0) return;

    // Assuming all items have the same keys
    const firstItemKeys = Object.keys(data[0]);
    console.log(firstItemKeys);
    const generatedColumns = firstItemKeys.map((key) => ({
      title: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()), // Convert snake_case to Title Case
      dataIndex: key,
      key: key,
    }));

    setColumns(generatedColumns);
  };

  const fetchServices = async () => {
    const res = await getTableData({ tableName: selectedTable });
    setData(res);
    generateColumnsFromData(res);
  };

  const { isLoading } = useQuery({
    queryKey: ["fetchServices", selectedTable], // Include selectedTable in the query key
    queryFn: fetchServices,
  });

  const handleTableChange = (value) => {
    setSelectedTable(value);
  };

  console.log({ data });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.main}>
      <div
        style={{
          padding: "2rem",
        }}
      >
        <h1
          style={{
            marginBottom: "1rem",
            color: "#FFF",
          }}
        >
          Train Schedule
        </h1>
        <Select
          style={{ width: 120, marginBottom: "1rem" }}
          onChange={handleTableChange}
          defaultValue={selectedTable}
        >
          <Option value="Train">Train</Option>
          <Option value="Ticket">Tickets</Option>
          <Option value="Station">Station</Option>
          <Option value="Schedule">Schedule</Option>
          <Option value="Payment">Payment</Option>
          <Option value="Passenger">Passenger</Option>
          <Option value="Seat">Seat</Option>
          {/* Add more options based on your tables */}
        </Select>
        <Table
          dataSource={data}
          columns={columns}
          bordered
          scroll={{ x: 965 }}
        />
      </div>
    </main>
  );
}
