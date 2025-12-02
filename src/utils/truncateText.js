// src/utils/truncateText.js

export default function truncateText(text, length = 120) {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
}
