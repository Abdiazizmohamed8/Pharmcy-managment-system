import { useState } from "react";

function useToast() {
  const [toasts, setToasts] =
    useState([]);

  const add = (
    message,
    type = "success"
  ) => {
    const id = Date.now();

    const newToast = {
      id,
      message,
      type,
    };

    setToasts((prev) => [
      ...prev,
      newToast,
    ]);

    setTimeout(() => {
      remove(id);
    }, 3000);
  };

  const remove = (id) => {
    setToasts((prev) =>
      prev.filter(
        (toast) =>
          toast.id !== id
      )
    );
  };

  return {
    toasts,
    add,
    remove,
  };
}

export default useToast;