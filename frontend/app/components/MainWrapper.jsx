"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import {
  BookOutlined,
  HomeOutlined,
  SearchOutlined,
  LoginOutlined,
} from "@ant-design/icons";

import { Menu, Layout } from "antd";
const { Header, Footer } = Layout;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function MainWrapper({ children }) {
  const router = useRouter();
  console.log(router.pathname);
  const defaultKey = () => {
    const path = usePathname();
    if (path === "/") {
      return "1";
    } else if (path === "/trains") {
      return "2";
    } else if (path === "/admin") {
      return "3";
    } else if (path === "/login"){
      return "0";
    }
  };

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
              defaultSelectedKeys={[defaultKey()]}
              items={[
                {
                  key: "0",
                  icon: <LoginOutlined />,
                  label: "Login",
                  onClick: (e) => {
                    console.log("clicked");
                    router.push("/login");
                  },
                },
                {
                  key: "1",
                  icon: <HomeOutlined />,
                  label: "Register",
                  onClick: (e) => {
                    console.log("clicked");
                    router.push("/");
                  },
                },
                {
                  key: "2",
                  icon: <BookOutlined />,
                  label: "Book Trains",
                  onClick: (e) => {
                    console.log("clicked");
                    router.push("/trains");
                  },
                },
                {
                  key: "3",
                  icon: <SearchOutlined />,
                  label: "Admin",
                  onClick: (e) => {
                    console.log("clicked");
                    router.push("/admin");
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
