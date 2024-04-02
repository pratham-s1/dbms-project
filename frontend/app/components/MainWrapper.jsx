"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { BookOutlined, HomeOutlined, SearchOutlined } from "@ant-design/icons";

import { Menu, Layout } from "antd";
const { Header, Footer } = Layout;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function MainWrapper({ children }) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <AntdRegistry>
        <Layout>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="demo-logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              items={[
                {
                  key: "1",
                  icon: <HomeOutlined />,
                  label: "Register",
                  onClick: (e) => {
                    console.log("clicked");
                    router.push("/register");
                  },
                },
                {
                  key: "2",
                  icon: <BookOutlined />,
                  label: "Book Trains",
                  onClick: (e) => {
                    console.log("clicked");
                    router.push("/");
                  },
                },
                {
                  key: "3",
                  icon: <SearchOutlined />,
                  label: "View All Trains",
                  onClick: (e) => {
                    console.log("clicked");
                    router.push("/trains");
                  },
                },
              ]}
              style={{
                flex: 1,
                minWidth: 0,
              }}
            />
          </Header>

          {children}
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Railway Reservation & Management Portal ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </AntdRegistry>
    </QueryClientProvider>
  );
}
