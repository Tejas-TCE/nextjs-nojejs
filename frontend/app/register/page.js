"use client";
import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ✅ React Toastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { register, error, loading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await register({ name, email, password });
      if (result.success) {
        toast.success(result.message || "Registration successful! You can now login.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again."); // ❌ Error notification
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="m-auto w-full max-w-md p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">OneBoss</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {success && (
            <div className="alert alert-success mb-6">
              {success}
            </div>
          )}

          {(formError || error) && (
            <div className="alert alert-error mb-6">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-control">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-control mt-4">
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
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>

            <div className="form-control mt-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium mt-6 hover:bg-blue-700 transition duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 