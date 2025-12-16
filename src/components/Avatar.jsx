import { memo, useState } from "react";

function Avatar({
  name = "User",
  size = 40,
  ring = true,
  className = "",
}) {
  const [error, setError] = useState(false);

  const seed = encodeURIComponent(name.trim() || "user");
  const avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${seed}`;
  const fallbackLetter = name.charAt(0).toUpperCase();

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-full overflow-hidden
        bg-gray-200 text-white font-semibold
        ${ring ? "ring-2 ring-gray-700 ring-offset-1" : ""}
        ${className}
      `}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
      }}
      aria-label={`Avatar of ${name}`}
    >
      {!error && (
        <img
          src={avatarUrl}
          alt={name}
          loading="lazy"
          onError={() => setError(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Fallback Initial */}
      {(error || !name) && (
        <span className="bg-purple-600 w-full h-full flex items-center justify-center">
          {fallbackLetter}
        </span>
      )}
    </div>
  );
}

export default memo(Avatar);
