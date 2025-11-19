export default function titleCaseConverter(input) {
  const str = String(input || "");

  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
