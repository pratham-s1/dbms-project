"use client";
import styles from "@/app/page.module.css";
import { Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "@/app/services/table.service";

export default function About() {
  const columns = [
    {
      title: "trainid",
      dataIndex: "train_id",
      key: "train_id",
    },
    {
      title: "Name",
      dataIndex: "train_name",
      key: "train_name",
    },
    {
      title: "Start Source",
      dataIndex: "start_source",
      key: "start_source",
    },
    {
      title: "End Destination",
      dataIndex: "end_destination",
      key: "end_destination",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  // const dataSource = [
  //   {
  //     key: "1",
  //     name: "Mike",
  //     age: 32,
  //     address: "10 Downing Street",
  //   },
  //   {
  //     key: "2",
  //     name: "John",
  //     age: 42,
  //     address: "10 Downing Street",
  //   },
  // ];
  const fetchServices = async () => {
    // Ensure getTableData is an async function or returns a promise
    return await getTableData({ tableName: "Trains" });
  };
  const { data, isLoading } = useQuery({
    queryKey: ["fetchServices"],
    queryFn: fetchServices,
  });
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
          }}
        >
          Train Schedule
        </h1>
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
