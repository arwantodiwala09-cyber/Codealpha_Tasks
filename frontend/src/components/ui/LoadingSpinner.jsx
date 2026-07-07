import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  size = "md",
  text = "",
  fullScreen = false,
  className = "",
}) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const spinner = (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        gap-4
        ${className}
      `}
    >
      <Loader2
        className={`
          animate-spin
          text-cyan-400
          ${sizes[size]}
        `}
      />

      {text && (
        <p
          className="
            text-slate-400
            text-sm
            font-medium
            animate-pulse
          "
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-slate-950/90
          backdrop-blur-sm
        "
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

// ===============================
// Page Loader
// ===============================
export function PageLoader({
  text = "Loading...",
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        min-h-[70vh]
      "
    >
      <LoadingSpinner
        size="xl"
        text={text}
      />
    </div>
  );
}

// ===============================
// Inline Loader
// ===============================
export function InlineLoader({
  text = "Loading...",
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
      <LoadingSpinner
        size="sm"
      />

      <span
        className="
          text-slate-400
          text-sm
        "
      >
        {text}
      </span>
    </div>
  );
}

// ===============================
// Full Screen Loader
// ===============================
export function FullScreenLoader({
  text = "Please wait...",
}) {
  return (
    <LoadingSpinner
      size="xl"
      text={text}
      fullScreen
    />
  );
}