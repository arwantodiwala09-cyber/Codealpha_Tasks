import axios from "axios";

const API_URL =
  "http://localhost:5000/api/files";

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

export const getProjectFiles =
  async (projectId) => {
    const response =
      await axios.get(
        `${API_URL}/project/${projectId}`,
        getAuthConfig()
      );

    return response.data;
  };

export const uploadFile =
  async (
    projectId,
    file
  ) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "projectId",
      projectId
    );

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const response =
      await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const deleteFile =
  async (fileId) => {
    const response =
      await axios.delete(
        `${API_URL}/${fileId}`,
        getAuthConfig()
      );

    return response.data;
  };