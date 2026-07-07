import api from "./api";

export const getMessages =
  async (projectId) => {
    const { data } =
      await api.get(
        `/messages/${projectId}`
      );

    return data;
  };

export const sendMessage =
  async (
    projectId,
    text
  ) => {
    const { data } =
      await api.post(
        `/messages/${projectId}`,
        {
          text,
        }
      );

    return data;
  };

export const addReaction =
  async (
    messageId,
    emoji
  ) => {
    const { data } =
      await api.put(
        `/messages/reaction/${messageId}`,
        {
          emoji,
        }
      );

    return data;
  };

export const editMessage =
  async (
    messageId,
    text
  ) => {
    const { data } =
      await api.put(
        `/messages/edit/${messageId}`,
        {
          text,
        }
      );

    return data;
  };

export const deleteMessage =
  async (
    messageId
  ) => {
    const { data } =
      await api.delete(
        `/messages/${messageId}`
      );

    return data;
  };

export const markProjectMessagesSeen =
  async (
    projectId
  ) => {
    const { data } =
      await api.put(
        `/messages/seen/project/${projectId}`
      );

    return data;
  };

export const markMessageSeen =
  async (
    messageId
  ) => {
    const { data } =
      await api.put(
        `/messages/seen/${messageId}`
      );

    return data;
  };