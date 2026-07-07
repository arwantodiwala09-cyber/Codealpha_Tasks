import api from "./api";

export const getUserProfile =
  async (userId) => {
    const { data } =
      await api.get(
        `/users/profile/${userId}`
      );

    return data;
  };