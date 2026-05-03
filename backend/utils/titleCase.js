/**
 * Title-case each whitespace-separated word (handles typical user names).
 */
function toTitleCase(input) {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word.length) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

module.exports = { toTitleCase };
