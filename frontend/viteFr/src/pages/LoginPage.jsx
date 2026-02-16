import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md border border-gray-200 rounded-3xl p-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-500 mb-8">Log in to manage your shared trips</p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Password */}
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-rose-500 text-white font-medium hover:bg-rose-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-rose-500 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );

};

export default LoginPage;
