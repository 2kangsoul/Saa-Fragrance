import backendlessApi from "../../../config/api" // Sesuaikan jika path-nya berbeda

export const fetchAdminsApi = async () => {
  const res = await backendlessApi.get("data/Users", {
    params: { where: "role='admin'" },
  });
  return res.data;
};

export const registerAdminApi = async (payload: any) => {
  return await backendlessApi.post("users/register", payload);
};

export const findUserByEmailApi = async (email: string) => {
  const res = await backendlessApi.get("data/Users", {
    params: { where: `email='${email}'` },
  });
  return res.data;
};

export const updateUserRoleApi = async (objectId: string, payload: any) => {
  return await backendlessApi.put(`data/Users/${objectId}`, payload);
};

export const deleteUserApi = async (objectId: string) => {
  return await backendlessApi.delete(`data/Users/${objectId}`);
};