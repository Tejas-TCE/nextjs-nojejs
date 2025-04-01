"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white relative overflow-hidden">
      {/* Mesh Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent opacity-70"></div>
      
      {/* Scene Container */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Moving Car */}
        <div className="absolute bottom-24 right-0 z-10 animate-car">
          <img
            src="/cartoo.png"
            alt="Car"
            className="w-54 h-64 object-contain"
          />
        </div>

        {/* Moving Road */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gray-800 overflow-hidden">
          <div className="absolute inset-0 animate-road">
            <div className="w-full h-full bg-gray-800"></div>
          </div>
        </div>

        {/* Trees */}
        <div className="absolute bottom-40 left-0 w-full flex justify-between px-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative">
              {/* Tree Trunk */}
              <div className="w-12 h-32 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg"></div>
              {/* Tree Top */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 bg-gradient-to-b from-green-500 to-green-700 rounded-full shadow-lg"></div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go back home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes car {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(calc(-100vw - 100%));
          }
        }

        @keyframes road {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-car {
          animation: car 8s linear infinite;
        }

        .animate-road {
          animation: road 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
