import axios from "axios";

const API_URL =
  "http://localhost:5000/api/activity";

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

export const getTaskActivity =
  async (taskId) => {
    const response =
      await axios.get(
        `${API_URL}/${taskId}`,
        getAuthConfig()
      );

    return response.data;
  };