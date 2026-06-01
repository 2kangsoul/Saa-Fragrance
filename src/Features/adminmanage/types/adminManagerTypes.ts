export interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AdminUser {
  objectId: string;
  name: string;
  email: string;
  role: string;
}