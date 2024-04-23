import axios from "axios";

const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export const getTableData = async ({ tableName }) => {
  const res = await apiClient.get(`${BASE_URL}/${tableName}`);
  console.log(res.data);
  return res.data?.results;
};

export const registeruser = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/register`, data);
  console.log(res.data);
  return res.data;
};

export const loginuser = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/login`, data);
  console.log(res.data);
  return res.data;
};

export const adminlogin = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/adminlogin`, data);
  console.log(res.data);
  return res.data;
};

export const forgot = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/forgot`, data);
  console.log(res.data);
  return res.data?.results;
};

export const search = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/search`, data);
  console.log(res.data);
  return res.data;
};

export const getTicket = async (data) => {
  const res = await apiClient.get(`${BASE_URL}/tickets`);
  console.log(res.data);
  return res.data?.results;
};

export const getStations = async (data) => {
  const res = await apiClient.get(`${BASE_URL}/getStations`);
  console.log(res.data);
  return res.data?.results;
};

export const getBookingDetails = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/checkoutDetails`, data);
  console.log(res.data);
  return res.data;
};

export const bookTicket = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/bookTicket`, data);
  console.log(res.data);
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/verifyPayment`, data);
  console.log(res.data);
  return res.data;
};

export const getTicketInfo = async (data) => {
  const res = await apiClient.post(`${BASE_URL}/getTicket`, data);
  console.log(res.data);
  return res.data;
};

export const logout = async () => {
  const res = await apiClient.post(`${BASE_URL}/logout`);
  console.log(res.data);
  return res.data;
};

export const getRevenue = async () => {
  const res = await apiClient.get(`${BASE_URL}/revenue`);
  console.log(res.data);
  return res.data;
};
