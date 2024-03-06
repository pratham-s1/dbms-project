import axios from "axios";
export const getTableData = async ({ tableName }) => {
  const res = await axios.get(`http://localhost:8080/${tableName}`);
  console.log(res.data);
  return res.data?.results;
};
