import axios from "axios";

const API_URL =
  "http://localhost:5000/api/team";

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

export const getAllUsers =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/users`,
        getAuthConfig()
      );

    return response.data;
  };