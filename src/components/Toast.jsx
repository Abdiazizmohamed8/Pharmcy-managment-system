function Toast({
  message,
  type = "success",
}) {

  return (
    <div
      style={{
        position: "fixed",

        top: "20px",

        right: "20px",

        zIndex: 9999,

        background:
          type === "error"
            ? "#dc2626"
            : "#16a34a",

        color: "#fff",

        padding:
          "14px 22px",

        borderRadius:
          "12px",

        fontWeight:
          "bold",

        boxShadow:
          "0 10px 25px rgba(0,0,0,0.15)",
      }}
    >
      {message}
    </div>
  );
}

export default Toast;