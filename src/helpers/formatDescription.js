export function formatDescription(data, term) {
  if (!data) return "";

  const description = data.shortdef.join(";\n");
  const examples = data.def
    .map((def) => def.sseq)
    .flat(Infinity)
    .filter((item) => typeof item !== "string" && item.dt)
    .map((obj) => obj.dt)
    .flat(Infinity)
    .filter((item) => typeof item !== "string" && item.t)
    .map((obj) =>
      obj.t
        .replaceAll(/{.*}(.*){.*}/g, "$1")
        .replaceAll(term, "_".repeat(term.length))
    )
    .slice(0, 5)
    .join("\n");

  return `${description}${examples.length ? "\n".repeat(3) : ""}${examples}`;
}
