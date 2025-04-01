"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "../../store/useAuthStore";
import ProtectedRoute from "../../components/ProtectedRoute";

const EditFAQ = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { editFAQ, loading, error, faqs } = useAuthStore();
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: ""
  });

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const faq = faqs.find(f => f._id === id);
      if (faq) {
        setFormData({
          question: faq.question,
          answer: faq.answer,
          category: faq.category
        });
      }
    }
  }, [searchParams, faqs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = searchParams.get('id');
    if (!id) return;

    const result = await editFAQ(id, formData);
    if (result.success) {
      router.push("/faq");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Edit FAQ</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update FAQ"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/faq")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default EditFAQ;
  