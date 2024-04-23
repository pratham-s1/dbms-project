"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getRevenue } from "../services/table.service";
import { Layout } from "antd";
const { Content } = Layout;

export default function RevenueGraph() {
  const { data, isLoading } = useQuery({
    queryKey: "getRevenue",
    queryFn: getRevenue,
  });

  console.log({ data });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Content style={{ padding: "0" }}>
      <Layout style={{ backgroundColor: "#111111", padding: 24 }}>
        <Content
          style={{
            minHeight: 280,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ width: "100%", height: 300 }}>
            <h1
              style={{
                color: "white",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              Completed Payments Revenue (Total Revenue: Rs.{" "}
              {parseInt(data?.totalRevenue) / 100} )
            </h1>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.results}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="created_at" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Content>
      </Layout>
    </Content>
  );
}
