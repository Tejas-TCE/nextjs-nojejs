"use client";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const { login, error: storeError, loading, isAuthenticated } = useAuthStore();
  // Use empty strings instead of default test credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    try {
      console.log("Submitting login form with:", { email });
      const result = await login({ email, password });
      console.log("Login result:", result);
      
      if (result.success) {
        console.log("Login successful, redirecting to dashboard");
        router.push("/dashboard");
      } else {
        setFormError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error in component:", err);
      setFormError("Something went wrong. Please try again.");
    }
  };

  // Display any error messages from the store or form
  const displayError = formError || storeError;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="m-auto w-full max-w-md p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">OneBoss</h1>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {displayError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {displayError}
            </div>
          )}

          <form onSubmit={handleLogin} suppressHydrationWarning>
            <div className="form-control">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                autoComplete="email"
                suppressHydrationWarning
              />
            </div>

            <div className="form-control mt-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                suppressHydrationWarning
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium mt-6 hover:bg-blue-700 transition duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              suppressHydrationWarning
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 