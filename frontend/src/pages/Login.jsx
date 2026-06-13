import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  FolderKanban,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } =
        await API.post(
          "/auth/login",
          formData
        );

      login(data);

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-cyan-600 to-blue-700 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="bg-white/10 p-5 rounded-3xl w-fit mb-6">
            <FolderKanban
              size={50}
            />
          </div>

          <h1 className="text-6xl font-black text-white">
            TaskFlow
          </h1>

          <p className="text-cyan-100 mt-6 text-xl">
            Manage projects,
            collaborate with teams,
            and track progress
            from one powerful
            workspace.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </h2>

            <p className="text-slate-400 mb-8">
              Sign in to continue
              to TaskFlow
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-slate-500"
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your email"
                    className="
                      w-full
                      bg-slate-800
                      border
                      border-slate-700
                      rounded-xl
                      py-3
                      pl-12
                      pr-4
                      text-white
                      focus:border-cyan-500
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-slate-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter password"
                    className="
                      w-full
                      bg-slate-800
                      border
                      border-slate-700
                      rounded-xl
                      py-3
                      pl-12
                      pr-12
                      text-white
                      focus:border-cyan-500
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-4 text-slate-500"
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
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-linear-to-r
                  from-cyan-500
                  to-blue-600
                  py-3
                  rounded-xl
                  font-semibold
                  hover:opacity-90
                  transition
                "
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            <p className="text-center text-slate-400 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}