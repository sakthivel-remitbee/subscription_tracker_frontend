import api from "@/utils/api";

export const getProfileRequest = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

export const logoutUserRequest = async (refreshToken?: string) => {
  const res = await api.post("/auth/logout", { refreshToken });
  return res.data;
};

export const updateProfileRequest = async (data: {
  name: string;
  email: string;
  timezone: string;
  currency: string;
}) => {
  const res = await api.put("/user/updates/details", data);
  return res.data;
};

export const updatePasswordRequest = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.put("/user/updates/password", data);
  return res.data;
};

export const uploadProfileImageRequest = async (formData: FormData) => {
  const res = await api.put("/user/store/img", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteUserRequest = async () => {
  const res = await api.delete("/user/delete");
  return res.data;
};
