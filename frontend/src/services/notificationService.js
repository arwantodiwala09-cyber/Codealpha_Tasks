import axios from "axios";

const API_URL =
  "http://localhost:5000/api/notifications";

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

export const getNotifications =
  async () => {
    const response =
      await axios.get(
        API_URL,
        getAuthConfig()
      );

    return response.data;
  };

export const markAsRead =
  async (id) => {
    const response =
      await axios.put(
        `${API_URL}/${id}/read`,
        {},
        getAuthConfig()
      );

    return response.data;
  };

export const markAllAsRead =
  async () => {
    const response =
      await axios.put(
        `${API_URL}/read-all`,
        {},
        getAuthConfig()
      );

    return response.data;
  };