import axios from "axios";

const API_URL =
  "http://localhost:5000/api/time";

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

// Start Timer
export const startTimer =
  async (taskId) => {
    const response =
      await axios.post(
        `${API_URL}/start`,
        { taskId },
        getAuthConfig()
      );

    return response.data;
  };

// Stop Timer
export const stopTimer =
  async () => {
    const response =
      await axios.post(
        `${API_URL}/stop`,
        {},
        getAuthConfig()
      );

    return response.data;
  };

// Get My Time Logs
export const getMyLogs =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/my`,
        getAuthConfig()
      );

    return response.data;
  };

// Get Logs For One Task
export const getTaskLogs =
  async (taskId) => {
    const response =
      await axios.get(
        `${API_URL}/task/${taskId}`,
        getAuthConfig()
      );

    return response.data;
  };

// Get Dashboard Time Statistics
export const getTimeStats =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/stats`,
        getAuthConfig()
      );

    return response.data;
  };