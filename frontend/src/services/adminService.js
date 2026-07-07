import axios from "axios";

const API_URL =
  "http://localhost:5000/api/admin";

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

// ==============================
// Dashboard Statistics
// ==============================
export const getAdminStats =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/stats`,
        getAuthConfig()
      );

    return response.data;
  };

// ==============================
// Get All Users
// ==============================
export const getUsers =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/users`,
        getAuthConfig()
      );

    return response.data;
  };

// ==============================
// Search Users
// ==============================
export const searchUsers =
  async (keyword) => {
    const response =
      await axios.get(
        `${API_URL}/users/search?keyword=${encodeURIComponent(
          keyword
        )}`,
        getAuthConfig()
      );

    return response.data;
  };

// ==============================
// Get Single User
// ==============================
export const getUser =
  async (id) => {
    const response =
      await axios.get(
        `${API_URL}/users/${id}`,
        getAuthConfig()
      );

    return response.data;
  };

// ==============================
// Update User Role
// ==============================
export const updateUserRole =
  async (
    id,
    role
  ) => {
    const response =
      await axios.put(
        `${API_URL}/users/${id}/role`,
        { role },
        getAuthConfig()
      );

    return response.data;
  };

// ==============================
// Block / Unblock User
// ==============================
export const toggleUserStatus =
  async (id) => {
    const response =
      await axios.put(
        `${API_URL}/users/${id}/status`,
        {},
        getAuthConfig()
      );

    return response.data;
  };

// ==============================
// Delete User
// ==============================
export const deleteUser =
  async (id) => {
    const response =
      await axios.delete(
        `${API_URL}/users/${id}`,
        getAuthConfig()
      );

    return response.data;
  };