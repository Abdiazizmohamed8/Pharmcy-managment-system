import { useState } from "react";

function useToast() {

  /* =========================
        STATE
  ========================= */

  const [
    toasts,
    setToasts,
  ] = useState([]);

  /* =========================
        ADD TOAST
  ========================= */

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

    /* AUTO REMOVE */

    setTimeout(() => {

      remove(id);

    }, 3000);
  };

  /* =========================
        REMOVE TOAST
  ========================= */

  const remove = (id) => {

    setToasts((prev) =>

      prev.filter(
        (toast) =>
          toast.id !== id
      )
    );
  };

  /* =========================
        RETURN
  ========================= */

  return {

    toasts,

    add,

    remove,
  };
}

export default useToast;