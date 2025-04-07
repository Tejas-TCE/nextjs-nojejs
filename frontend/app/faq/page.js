"use client";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { FaPlus, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaEye, FaEyeSlash, FaRecycle } from "react-icons/fa";

export default function FAQPage() {
  const router = useRouter();
  const { faqs, loading, error, fetchFAQs, deleteFAQ, softDeleteFAQ, restoreFAQ, addFAQ, user, totalPages } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [showDeleted, setShowDeleted] = useState(true);
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
    category: "",
  });

  const itemsPerPage = 5;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchFAQs(1, itemsPerPage, searchTerm.trim(), showDeleted);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Toggle showing deleted FAQs
  const handleToggleShowDeleted = () => {
    const newShowDeleted = !showDeleted;
    setShowDeleted(newShowDeleted);
    fetchFAQs(currentPage, itemsPerPage, searchTerm.trim(), newShowDeleted);
  };

  useEffect(() => {
    fetchFAQs(currentPage, itemsPerPage, searchTerm.trim(), showDeleted);
  }, [currentPage, fetchFAQs]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    try {
      const result = await addFAQ(newFAQ);
      if (result.success) {
        setNewFAQ({ question: "", answer: "", category: "" });
        setIsAddingFAQ(false);
        setCurrentPage(1);
        fetchFAQs(1, itemsPerPage, searchTerm, showDeleted);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
      alert("Failed to add FAQ. Please try again.");
    }
  };

  // Show delete options modal
  const handleDeleteClick = (faq) => {
    setFaqToDelete(faq);
    setShowDeleteModal(true);
  };

  // Permanent delete
  const handleHardDelete = async () => {
    if (!faqToDelete) return;
    
    try {
      const result = await deleteFAQ(faqToDelete._id);
      if (result.success) {
        if (faqs.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        fetchFAQs(currentPage, itemsPerPage, searchTerm, showDeleted);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }finally {
      setShowDeleteModal(false);
      setFaqToDelete(null);
    }
  };

  // Soft delete (move to trash)
  const handleSoftDelete = async () => {
    if (!faqToDelete) return;
    
    try {
      const result = await softDeleteFAQ(faqToDelete._id);
      if (result.success) {
        if (faqs.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        fetchFAQs(currentPage, itemsPerPage, searchTerm, showDeleted);
      } else {
        alert(`one ${result.message}`);
      }
    } catch (error) {
      console.error("Error soft deleting FAQ:", error);
    } finally {
      setShowDeleteModal(false);
      setFaqToDelete(null);
    }
  };

  // Restore from trash
  const handleRestore = async (id) => {
    try {
      const result = await restoreFAQ(id);
      if (result.success) {
        fetchFAQs(currentPage, itemsPerPage, searchTerm, showDeleted);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error restoring FAQ:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
              <p className="text-sm text-gray-500 mt-1">Find answers to common questions</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleToggleShowDeleted}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors duration-200 ${
                showDeleted 
                  ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {showDeleted ? (
                <>
                  <FaEye className="mr-2" />
                  <span>Show Deleted</span>
                </>
              ) : (
                <>
                  <FaEyeSlash className="mr-2" />
                  <span>Showing All</span>
                </>
              )}
            </button>
            
            {user && (
              <button
                onClick={() => setIsAddingFAQ(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaPlus className="mr-2" /> Add FAQ
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative flex">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search FAQs by question, answer, or category..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              autoComplete="off"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              onClick={handleSearchSubmit}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {faqs.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {faqs.map((faq) => (
                <li 
                  key={faq._id} 
                  className={`p-6 transition-colors duration-200 ${
                    faq.isDeleted 
                      ? 'bg-red-50 hover:bg-red-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* DP Circle */}
                      <div className="flex-shrink-0">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
                          <span className="text-blue-600 font-bold text-xl">
                            {(faq.user?.name || 'Anonymous').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 flex-wrap">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            by {faq.user?.name || 'Anonymous'}
                          </span>
                          {faq.isDeleted && (
                            <span className="text-sm text-white bg-red-500 px-2 py-1 rounded-full">
                              Deleted
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
                        <div className="mt-4 flex items-center space-x-3 flex-wrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                            {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Added by {faq.user?.name || 'Anonymous'}
                          </span>
                          {faq.isDeleted && faq.deletedAt && (
                            <span className="text-sm text-gray-500">
                              Deleted on: {new Date(faq.deletedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {user && (
                      <div className="ml-6 flex-shrink-0 flex space-x-4">
                        {!faq.isDeleted ? (
                          <>
                            <button
                              onClick={() => router.push(`/editFAQ?id=${faq._id}`)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                              title="Edit FAQ"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(faq)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                              title="Delete FAQ"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(faq._id)}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200 p-2 rounded-full hover:bg-green-50"
                            title="Restore FAQ"
                          >
                            <FaRecycle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">
                No FAQs found. {!showDeleted && "Try showing deleted FAQs or"} add a new FAQ.
              </p>
            </div>
          )}
        </div>

        {/* Pagination - Made responsive */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1||totalPages === 0}
            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex flex-wrap items-center gap-1">
            {totalPages <= 5 ? (
              // Show all page numbers if 5 or fewer
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              // Show pagination with ellipsis for more than 5 pages
              <>
                {/* First page always shown */}
                <button
                  onClick={() => handlePageChange(1)}
                  className={`inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  1
                </button>

                {/* Left ellipsis if needed */}
                {currentPage > 3 && (
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm">
                    ...
                  </span>
                )}

                {/* Current page neighborhood */}
                {[...Array(totalPages)].slice(1, -1).map((_, i) => {
                  const pageNum = i + 2;
                  // Show pages adjacent to current page
                  if (
                    pageNum === currentPage - 1 || 
                    pageNum === currentPage || 
                    pageNum === currentPage + 1
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                }).filter(Boolean)}

                {/* Right ellipsis if needed */}
                {currentPage < totalPages - 2 && (
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm">
                    ...
                  </span>
                )}

                {/* Last page always shown */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span className="hidden sm:inline">Next</span>
            <FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
          </button>
        </div>



        {/* Add FAQ Modal */}
        {isAddingFAQ && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New FAQ</h2>
                <button
                  onClick={() => setIsAddingFAQ(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddFAQ} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter question"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <textarea
                    id="answer"
                    name="answer"
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter answer"
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={newFAQ.category}
                    onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter category (e.g., General, Technical, etc.)"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Add FAQ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingFAQ(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Options Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Options</h3>
              <p className="text-gray-600 mb-6">How would you like to delete this FAQ?</p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleHardDelete}
                  className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Delete Permanently
                </button>
                
                <button
                  onClick={handleSoftDelete}
                  className="px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                >
                  Move to Trash
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
