"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getTableData } from "./services/table.service";

export default function Home() {
  const columns = [
    {
      title: "userid",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
    return await getTableData({ tableName: "Users" });
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
      <div className={styles.grid}>
        <Table dataSource={data} columns={columns} />
      </div>
    </main>
  );
}
