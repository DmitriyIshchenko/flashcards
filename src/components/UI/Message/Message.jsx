import "./Message.scss";

function Message({ message, isError }) {
  return (
    <p className="message">
      <span>{isError ? "❌" : "👋"}</span>
      <span>{message}</span>
    </p>
  );
}

export default Message;
