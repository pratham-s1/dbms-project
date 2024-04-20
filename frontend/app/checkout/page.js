"use client";

import { search } from "@/app/services/table.service";
import { useState } from "react";
import {
  Form,
  Select,
  Layout,
  Button,
  DatePicker,
  notification,
  Table,
  Divider,
} from "antd";
const { Content } = Layout;
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

export default function Login() {
  const { train_id, station_id } = useParams();

  console.log({ train_id, station_id });

  const [data, setData] = useState([]);

  const onFormSubmit = async (values) => {
    try {
      console.log(values);
      const res = await search(values);
      console.log(res);

      setData(res);
      generateColumnsFromData(res);
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

  return (
    <Content
      style={{
        padding: "0 48px",
      }}
    >
      <Layout
        style={{
          padding: "24px 0",
        }}
      >
        <Content
          style={{
            padding: "12px 24px",
            minHeight: 280,
          }}
        >
          <h1>Checkout</h1>
          <p></p>
        </Content>
      </Layout>
    </Content>
  );
}
