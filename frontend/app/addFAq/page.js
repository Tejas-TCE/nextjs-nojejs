"use client";
import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import ProtectedRoute from "../../components/ProtectedRoute";

const FAQForm = () => {
  const { addFAQ, loading, error } = useAuthStore();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const result = await addFAQ({ question, answer, category });

    if (result.success) {
      setSuccessMessage("FAQ added successfully!");
      setQuestion("");
      setAnswer("");
      setCategory("");
    }
  };

  return (
    <ProtectedRoute>
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add a New FAQ</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add FAQ"}
        </button>
      </form>
    </div>
    </ProtectedRoute>
  );
};

export default FAQForm;
