import axios from "axios";

const BASE_URL = "http://localhost:5000/auth";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${BASE_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${BASE_URL}/login`, data);
  return res.data;
};