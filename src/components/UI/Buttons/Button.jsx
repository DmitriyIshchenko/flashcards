import "./Button.scss";

export default function Button({
  type = "button",
  className = "",
  onClick,
  round,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn ${round ? `btn--round` : ""} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
