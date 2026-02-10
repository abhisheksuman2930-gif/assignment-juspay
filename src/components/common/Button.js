import React from "react";

export default function Button({
  children,
  onClick,
  variant = "default",
  size = "xs",
  className = "",
  type = "button",
  disabled = false,
}) {
  let base =
    "inline-flex items-center justify-center rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-offset-1";

  if (size === "xs") {
    base += " px-3 py-1";
  } else if (size === "sm") {
    base += " px-4 py-2";
  }

  let colorClasses = "";
  switch (variant) {
    case "primary":
      colorClasses =
        "bg-blue-500 text-white shadow hover:bg-blue-600 border border-blue-500";
      break;
    case "secondary":
      colorClasses =
        "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200";
      break;
    case "danger":
      colorClasses =
        "bg-red-500 text-white shadow hover:bg-red-600 border border-red-500";
      break;
    case "success":
      colorClasses =
        "bg-green-500 text-white shadow hover:bg-green-600 border border-green-500";
      break;
    default:
      colorClasses = "bg-white text-gray-800 border border-gray-300";
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${base} ${colorClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
