import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as any;

    // Validation errors (Laravel-style)
    if (payload?.data?.errors) {
      Object.values(payload.data.errors).forEach((messages: any) => {
        toast.error(messages[0]);
      });
    } 
    // Single error message
    else {
      toast.error(payload?.data?.message || "Something went wrong");
    }
  }

  return next(action);
};
