import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"

export const getTableData = async ({ tableName }) => {
  const res = await axios.get(`${BASE_URL}/${tableName}`);
  console.log(res.data);
  return res.data?.results;
};

export const registeruser = async (data) => {
  const res = await axios.post(`${BASE_URL}/register`, data);
  console.log(res.data);
  return res.data;
};

export const loginuser = async (data) => {
  const res = await axios.post(`${BASE_URL}/login`, data);
  console.log(res.data);
  return res.data;
};


export const forgot = async (data) => {
  const res = await axios.post(`${BASE_URL}/forgot`, data);
  console.log(res.data);
  return res.data?.results;
};


export const search = async (data) => {
  const res = await axios.post(`${BASE_URL}/search`, data);
  console.log(res.data);
  return res.data;
};

export const getTicket = async (data) => {
  const res = await axios.get(`${BASE_URL}/tickets`);
  console.log(res.data);
  return res.data?.results;
};

export const getStations = async (data) => {
  const res = await axios.get(`${BASE_URL}/getStations`);
  console.log(res.data);
  return res.data?.results;
};