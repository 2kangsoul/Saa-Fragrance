import backendlessApi from "../../../config/api"; // Sesuaikan path jika berbeda

export const fetchBlogsApi = async () => {
  const response = await backendlessApi.get("data/Blogs?sortBy=created%20desc");
  return response.data || response;
};

export const deleteBlogApi = async (objectId: string) => {
  return await backendlessApi.delete(`data/Blogs/${objectId}`);
};

export const createBlogApi = async (payload: any) => {
  return await backendlessApi.post("data/Blogs", payload);
};

export const updateBlogApi = async (objectId: string, payload: any) => {
  return await backendlessApi.put(`data/Blogs/${objectId}`, payload);
};

export const generateBlogAIApi = async (payload: any) => {
  const response = await fetch("/api/generate-blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghubungi AI");
  }

  return data;
};