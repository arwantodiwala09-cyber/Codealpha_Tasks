import axios from "axios";

const API_URL =
  "http://localhost:5000/api/projects";

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

export const getProjects =
  async () => {
    const response =
      await axios.get(
        API_URL,
        getAuthConfig()
      );

    return response.data;
  };

export const getProjectById =
  async (id) => {
    const response =
      await axios.get(
        `${API_URL}/${id}`,
        getAuthConfig()
      );

    return response.data;
  };

export const createProject =
  async (projectData) => {
    const response =
      await axios.post(
        API_URL,
        projectData,
        getAuthConfig()
      );

    return response.data;
  };

export const addMemberToProject =
  async (
    projectId,
    email
  ) => {
    const response =
      await axios.post(
        `${API_URL}/${projectId}/add-member`,
        { email },
        getAuthConfig()
      );

    return response.data;
  };

export const removeMemberFromProject =
  async (
    projectId,
    userId
  ) => {
    const response =
      await axios.delete(
        `${API_URL}/${projectId}/members/${userId}`,
        getAuthConfig()
      );

    return response.data;
  };