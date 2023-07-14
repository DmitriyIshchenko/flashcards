import "./Button.scss";

export default function Button({
  type = "button",
  className = "",
  onClick,
  children,
  round,
  disabled,
}) {
  console.log(round);
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn ${round ? `btn--round` : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
