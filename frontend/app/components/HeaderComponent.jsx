"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Layout, Menu } from "antd";
import { useSelector } from "react-redux";
import {
  HomeOutlined,
  LoginOutlined,
  SearchOutlined,
  BookOutlined,
} from "@ant-design/icons";
const { Header } = Layout;

export default function HeaderComponent() {
  const router = useRouter();
  const path = usePathname();

  const user = useSelector((state) => state.user);

  const defaultKey = () => {
    if (path === "/register") {
      return "1";
    } else if (path === "/trains") {
      return "2";
    } else if (path === "/admin") {
      return "3";
    } else if (path === "/landing") {
      return "4";
    } else if (path === "/") {
      return "0";
    }
  };
  return (
    <>
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
          items={
            user?.passenger_id
              ? [
                  {
                    key: "2",
                    icon: <SearchOutlined />,
                    label: "Search Trains",
                    onClick: (e) => {
                      router.push("/trains");
                    },
                  },
                ]
              : [
                  {
                    key: "0",
                    icon: <LoginOutlined />,
                    label: "Login",
                    onClick: (e) => {
                      console.log("clicked");
                      router.push("/");
                    },
                  },
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
                    icon: <SearchOutlined />,
                    label: "Search Trains",
                    onClick: (e) => {
                      console.log("clicked");
                      router.push("/trains");
                    },
                  },
                  {
                    key: "3",
                    icon: <BookOutlined />,
                    label: "Admin",
                    onClick: (e) => {
                      console.log("clicked");
                      router.push("/admin");
                    },
                  },
                ]
          }
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
    </>
  );
}
