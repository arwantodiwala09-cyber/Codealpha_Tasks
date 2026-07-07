import API from "./api";

export const updateUserRole =
  async (
    userId,
    role
  ) => {
    const { data } =
      await API.put(
        `/users/${userId}/role`,
        { role }
      );

    return data;
  };

export const getUserProfile =
  async (id) => {
    const { data } =
      await API.get(
        `/users/profile/${id}`
      );

    return data;
  };