"use client";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to OneBoss
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your all-in-one business management solution
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h2>
              <p className="text-gray-600">
                Access your business metrics and analytics in one place
              </p>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tasks</h2>
              <p className="text-gray-600">
                Manage and track your team's tasks efficiently
              </p>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reports</h2>
              <p className="text-gray-600">
                Generate detailed reports and insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 