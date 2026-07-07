import api from "./api";

// ===============================
// Get User Profile
// ===============================

export const getProfile = async () => {
  const { data } = await api.get(
    "/settings/profile"
  );

  return data;
};

// ===============================
// Update Profile
// ===============================

export const updateProfile = async (
  profile
) => {
  const { data } = await api.put(
    "/settings/profile",
    profile
  );

  return data;
};

// ===============================
// Update Preferences
// ===============================

export const updatePreferences =
  async (preferences) => {
    const { data } = await api.put(
      "/settings/preferences",
      preferences
    );

    return data;
  };

// ===============================
// Change Password
// ===============================

export const changePassword =
  async (passwords) => {
    const { data } = await api.put(
      "/settings/password",
      passwords
    );

    return data;
  };

// ===============================
// Logout All Devices
// ===============================

export const logoutAllDevices =
  async () => {
    const { data } = await api.post(
      "/settings/logout-all"
    );

    return data;
  };

// ===============================
// Delete Account
// ===============================

export const deleteAccount =
  async () => {
    const { data } =
      await api.delete(
        "/settings/delete-account"
      );

    return data;
  };