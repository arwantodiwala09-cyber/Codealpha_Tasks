import API from "./api";

export const updateUserRole =
  async (
    userId,
    role
  ) => {
    const { data } =
      await API.put(
        `/team/users/${userId}/role`,
        { role }
      );

    return data;
  };