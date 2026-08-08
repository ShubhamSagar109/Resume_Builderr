import axios from "axios";

export const baseURL = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const generateResume = async (description) => {
  if (!description || !description.trim()) {
    throw new Error("Resume description cannot be empty.");
  }

  const response = await axiosInstance.post(
    "/api/v1/resume/generate",
    {
      userDescription: description.trim(),
    }
  );

  return response.data;
};