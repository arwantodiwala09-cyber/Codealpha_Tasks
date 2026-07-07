import axios from "axios";

const API_URL =
  "http://localhost:5000/api/reports";

const getAuthConfig = () => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};

// ===============================
// Project Report
// ===============================
export const getProjectReport =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/projects`,
        getAuthConfig()
      );

    return response.data;
  };

// ===============================
// Task Report
// ===============================
export const getTaskReport =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/tasks`,
        getAuthConfig()
      );

    return response.data;
  };

// ===============================
// Time Tracking Report
// ===============================
export const getTimeReport =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/time`,
        getAuthConfig()
      );

    return response.data;
  };

// ===============================
// Productivity Report
// ===============================
export const getProductivityReport =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/productivity`,
        getAuthConfig()
      );

    return response.data;
  };