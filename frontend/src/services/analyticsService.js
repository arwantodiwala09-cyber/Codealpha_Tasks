import axios from "axios";

const API_URL =
  "http://localhost:5000/api/analytics";

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

export const getAnalytics =
  async () => {
    const response =
      await axios.get(
        API_URL,
        getAuthConfig()
      );

    return response.data;
  };