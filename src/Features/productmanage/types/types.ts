// src/Features/productmanage/types.ts

export interface PerfumeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Product {
  objectId: string;
  name: string;
  brand: string;
  price: number;
}

export interface PerfumeFormData {
  name: string;
  brand: string;
  price: string;
  stock: string;
  type: string;
  usage_time: string;
  notes: string;
  sillage: string;
  projection: string;
  longevity: string;
  description: string;
  imageUrl: string;
  blind_buy_safe: boolean;
}