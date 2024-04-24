"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Layout, Menu, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  HomeOutlined,
  LoginOutlined,
  SearchOutlined,
  BookOutlined,
  LogoutOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { logout } from "../services/table.service";
import { clearUser } from "../store/user.slice";
const { Header } = Layout;

export default function HeaderComponent() {
  const router = useRouter();

  const dispatch = useDispatch();
  const path = usePathname();

  const user = useSelector((state) => state.user);

  const defaultKey = () => {
    if (path === "/register") {
      return "1";
    } else if (path === "/search") {
      return "2";
    } else if (path === "/admin") {
      return "3";
    } else if (path === "/landing") {
      return "4";
    } else if (path === "/dashboard") {
      return "5";
    } else if (path === "/revenue") {
      return "7";
    } else if (path === "/") {
      return "0";
    }
  };

  const renderMenu = () => {
    if (user?.isLoggedIn) {
      if (user?.is_admin) {
        return [
          {
            key: "2",
            icon: <SearchOutlined />,
            label: "Search Trains",
            onClick: (e) => {
              router.push("/search");
            },
          },
          {
            key: "5",
            icon: <HomeOutlined />,
            label: "Admin Dashboard",
            onClick: (e) => {
              router.push("/admin");
            },
          },
          {
            key: "7",
            icon: <StockOutlined />,
            label: "Revenue",
            onClick: (e) => {
              router.push("/revenue");
            },
          },
          {
            key: "6",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: async (e) => {
              dispatch(clearUser());
              localStorage.clear();
              await logout();
              notification.success({
                message: "Success",
                description: "Logged out successfully",
              });
              router.push("/");
            },
          },
        ];
      } else {
        return [
          {
            key: "2",
            icon: <SearchOutlined />,
            label: "Search Trains",
            onClick: (e) => {
              router.push("/search");
            },
          },
          {
            key: "5",
            icon: <HomeOutlined />,
            label: "Dashboard",
            onClick: (e) => {
              router.push("/dashboard");
            },
          },
          {
            key: "6",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: async (e) => {
              dispatch(clearUser());
              localStorage.clear();
              await logout();
              notification.success({
                message: "Success",
                description: "Logged out successfully",
              });
              router.push("/");
            },
          },
        ];
      }
    } else {
      return [
        {
          key: "0",
          icon: <LoginOutlined />,
          label: "Login",
          onClick: async (e) => {
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
            router.push("/search");
          },
        },
      ];
    }
  };

  useEffect(() => {
    if (user?.isLoggedIn && path === "/") {
      console.log("logged in");
      router.push("/search");
    }
  }, [user, path]);

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {console.log("user", user)}
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[defaultKey()]}
          items={renderMenu().map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
          }))}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
    </>
  );
}
