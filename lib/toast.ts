import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export const toast = ({ title, description, variant = "default" }: ToastOptions) => {
  const message = title && description ? `${title}: ${description}` : title || description || "";
  
  switch (variant) {
    case "destructive":
      return sonnerToast.error(message);
    case "success":
      return sonnerToast.success(message);
    default:
      return sonnerToast(message);
  }
};

// Export individual toast functions for convenience
export const toastSuccess = (message: string) => sonnerToast.success(message);
export const toastError = (message: string) => sonnerToast.error(message);
export const toastInfo = (message: string) => sonnerToast(message);
export const toastWarning = (message: string) => sonnerToast.warning(message);
