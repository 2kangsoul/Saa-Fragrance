// src/Features/productmanage/api.ts

import backendlessApi from "../../../config/api"
import type { PerfumeFormData } from "../types/types"

export const fetchProductsApi = async () => {
  const res = await backendlessApi.get("data/Product", {
    params: { pageSize: 100, sortBy: "created desc" },
  });
  return res.data;
};

export const addProductApi = async (data: PerfumeFormData) => {
  const res = await backendlessApi.post("data/Product", {
    ...data,
    price: Number(data.price),
  });
  return res.data;
};

export const deleteProductApi = async (objectId: string) => {
  const res = await backendlessApi.delete(`data/Product/${objectId}`);
  return res.data;
};