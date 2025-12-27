import { memo, useState } from "react";

function Avatar({
  name = "",
  size = 40,
  ring = true,
  className = "",
}) {
  const [error, setError] = useState(false);

  // ✅ SAFE NAME
  const safeName =
    typeof name === "string" && name.trim().length > 0
      ? name.trim()
      : "";

  // 🎨 DiceBear avatar (only if name exists)
  const seed = encodeURIComponent(safeName || "anonymous");
  const avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${seed}`;

  // 🔠 First letter fallback
  const fallbackLetter = safeName
    ? safeName.charAt(0).toUpperCase()
    : "?";

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-full overflow-hidden
        bg-gray-300 text-white font-bold
        ${ring ? "ring-2 ring-gray-700 ring-offset-1" : ""}
        ${className}
      `}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
      }}
      aria-label={`Avatar of ${safeName || "user"}`}
    >
      {/* ✅ Avatar image */}
      {!error && safeName && (
        <img
          src={avatarUrl}
          alt={safeName}
          loading="lazy"
          onError={() => setError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* ✅ PERFECT FALLBACK */}
      {(error || !safeName) && (
        <span className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
          {fallbackLetter}
        </span>
      )}
    </div>
  );
}

export default memo(Avatar);
