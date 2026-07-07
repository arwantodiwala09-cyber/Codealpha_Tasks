import axios from "axios";

const API_URL =
  "http://localhost:5000/api/comments";

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

export const getCommentsByTask =
  async (taskId) => {
    const response =
      await axios.get(
        `${API_URL}/task/${taskId}`,
        getAuthConfig()
      );

    return response.data;
  };

export const createComment =
  async (
    taskId,
    text,
    attachments = []
  ) => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const formData =
      new FormData();

    formData.append(
      "taskId",
      taskId
    );

    formData.append(
      "text",
      text || ""
    );

    attachments.forEach(
      (file) => {
        formData.append(
          "attachments",
          file
        );
      }
    );

    const response =
      await axios.post(
        API_URL,
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

export const deleteComment =
  async (commentId) => {
    const response =
      await axios.delete(
        `${API_URL}/${commentId}`,
        getAuthConfig()
      );

    return response.data;
  };