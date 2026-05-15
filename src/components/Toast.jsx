import React from "react";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  // Toast styles based on type
  const toastTypes = {
    success: {
      bg: "bg-green-600",
      icon: "✅",
      title: "Success",
    },

    error: {
      bg: "bg-red-600",
      icon: "❌",
      title: "Error",
    },

    warning: {
      bg: "bg-amber-500",
      icon: "⏰",
      title: "Warning",
    },
  };

  // Active toast type
  const current =
    toastTypes[type] ||
    toastTypes.success;

  return (
    <div
      className="animate-[slideIn_.35s_ease]
      w-full max-w-[95vw] sm:max-w-sm md:max-w-md"
    >
      {/* Toast Box */}
      <div
        className={`${current.bg}
        text-white rounded-2xl
        p-4 shadow-2xl
        border border-white/10
        flex items-start gap-3`}
      >
        {/* Icon */}
        <div
          className="min-w-[46px] h-[46px]
          rounded-xl bg-white/20
          flex items-center justify-center
          text-xl"
        >
          {current.icon}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-base sm:text-lg mb-1">
            {current.title}
          </h3>

          <p
            className="text-sm sm:text-[15px]
            leading-6 opacity-95 break-words"
          >
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-xl hover:opacity-70 transition"
        >
          ✕
        </button>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Toast;