import axios from "axios";
export const getTableData = async ({ tableName }) => {
  const res = await axios.get(`http://localhost:8080/${tableName}`);
  console.log(res.data);
  return res.data?.results;
};

export const registeruser = async (data) => {
  const res = await axios.post(`http://localhost:8080/register`, data);
  console.log(res.data);
  return res.data?.results;
};

export const loginuser = async (data) => {
  const res = await axios.post(`http://localhost:8080/login`, data);
  console.log(res.data);
  return res.data?.results;
};


export const forgot = async (data) => {
  const res = await axios.post(`http://localhost:8080/forgot`, data);
  console.log(res.data);
  return res.data?.results;
};
