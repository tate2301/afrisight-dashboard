import React from "react";

type Props = {
  type: "error" | "success" | "message";
  text: string;
};

function AlertMessage({ type, text }: Props) {
  return (
    <div
      className={`${type === "error"
        ? "bg-red-100 "
        : type === "success"
          ? "bg-green-100"
          : "bg-blue-100"
        } text-[13px] font-medium p-2 rounded-lg`}
    >
      <p
        className={`${type === "error"
          ? "text-red-600 "
          : type === "success"
            ? "text-green-600"
            : "text-blue-600"
          } text-center`}
      >
        {text}
      </p>
    </div>
  );
}

export default AlertMessage;
