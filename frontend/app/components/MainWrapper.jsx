"use client";
import React from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";

import { Layout } from "antd";
const { Header, Footer } = Layout;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "../store/store";
import HeaderComponent from "./HeaderComponent";
const queryClient = new QueryClient();

export default function MainWrapper({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdRegistry>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <HeaderComponent />
            <Layout>
              <div
                style={{
                  height: "100%",
                  backgroundColor: "#111111",
                }}
              >
                {children}
              </div>
              <Footer
                style={{
                  textAlign: "center",
                  backgroundColor: "#111111",
                  color: "#fff",
                }}
              >
                RailEz ©{new Date().getFullYear()}
              </Footer>
            </Layout>
          </PersistGate>
        </Provider>
      </AntdRegistry>
    </QueryClientProvider>
  );
}
