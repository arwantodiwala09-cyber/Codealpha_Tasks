import axios from "axios";

const API_URL =
  "http://localhost:5000/api/tasks";

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

export const getMyTasks =
  async () => {
    const response =
      await axios.get(
        API_URL,
        getAuthConfig()
      );

    return response.data;
  };

export const getAssignedTasks =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/assigned`,
        getAuthConfig()
      );

    return response.data;
  };

export const getDueTodayTasks =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/due-today`,
        getAuthConfig()
      );

    return response.data;
  };

export const getOverdueTasks =
  async () => {
    const response =
      await axios.get(
        `${API_URL}/overdue`,
        getAuthConfig()
      );

    return response.data;
  };

export const getTasksByProject =
  async (projectId) => {
    const response =
      await axios.get(
        `${API_URL}/project/${projectId}`,
        getAuthConfig()
      );

    return response.data;
  };

export const createTask =
  async (taskData) => {
    const response =
      await axios.post(
        API_URL,
        taskData,
        getAuthConfig()
      );

    return response.data;
  };

export const updateTask =
  async (id, taskData) => {
    const response =
      await axios.put(
        `${API_URL}/${id}`,
        taskData,
        getAuthConfig()
      );

    return response.data;
  };

export const deleteTask =
  async (id) => {
    const response =
      await axios.delete(
        `${API_URL}/${id}`,
        getAuthConfig()
      );

    return response.data;
  };