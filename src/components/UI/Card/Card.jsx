import "./Card.scss";

export default function Card({
  className,
  listItem = false,
  onClick,
  children,
}) {
  return (
    <>
      {listItem ? (
        <li className={`card ${className}`} onClick={onClick}>
          {children}
        </li>
      ) : (
        <article className={`card ${className}`} onClick={onClick}>
          {children}
        </article>
      )}
    </>
  );
}
