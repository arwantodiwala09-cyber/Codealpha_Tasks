import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useState,
} from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  icon = null,
  error = "",
  helperText = "",
  disabled = false,
  required = false,
  className = "",
  ...props
}) {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="w-full">

      {label && (
        <label
          className="
            block
            mb-2
            text-sm
            font-semibold
            text-slate-300
          "
        >
          {label}

          {required && (
            <span className="text-red-400 ml-1">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">

        {icon && (
          <div
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          >
            {icon}
          </div>
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            bg-slate-900
            border
            rounded-xl
            py-3
            text-white
            placeholder:text-slate-500
            outline-none
            transition-all
            duration-300
            disabled:opacity-50
            disabled:cursor-not-allowed

            ${
              icon
                ? "pl-12"
                : "pl-4"
            }

            ${
              type === "password"
                ? "pr-12"
                : "pr-4"
            }

            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-slate-700 focus:border-cyan-500"
            }

            ${className}
          `}
          {...props}
        />

        {type ===
          "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-500
              hover:text-cyan-400
              transition
            "
          >
            {showPassword ? (
              <EyeOff
                size={18}
              />
            ) : (
              <Eye
                size={18}
              />
            )}
          </button>
        )}

      </div>

      {error ? (
        <p
          className="
            mt-2
            text-sm
            text-red-400
          "
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          {helperText}
        </p>
      ) : null}

    </div>
  );
}