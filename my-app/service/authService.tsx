import axios from "axios";

export const registerUser = async (data: any) => {
  const res = await axios.post(
    "http://localhost:5000/auth/register",
    data
  );
  return res.data;
};