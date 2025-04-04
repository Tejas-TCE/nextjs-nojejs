"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // ✅ Added useRouter import
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore(); // ✅ Zustand store access
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // ✅ useRouter Hook

  // Don't show navbar on login and register pages
  const hideNavbarPages = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarPages.includes(pathname);

  // Logout function with redirect
  const handleLogout = () => {
    logout(); // Zustand store logout function
    router.push("/login"); // ✅ Redirect to login after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Hide navbar completely on login/register pages
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="text-xl font-bold text-white">
            OneBoss
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-blue-100 px-3 py-2 rounded-md transition duration-300">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/about" className="text-white hover:text-blue-100 px-3 py-2 rounded-md transition duration-300">
                  About
                </Link>
                <Link href="/faq" className="text-white hover:text-blue-100 px-3 py-2 rounded-md transition duration-300">
                  FAQ
                </Link>
                <Link href="/dashboard" className="text-white hover:text-blue-100 px-3 py-2 rounded-md transition duration-300">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout} // ✅ Now calling handleLogout
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:text-blue-100 px-3 py-2 rounded-md transition duration-300">
                  Login
                </Link>
                <Link href="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md transition duration-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <Link 
              href="/" 
              className="block text-white hover:bg-blue-500 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/about" 
                  className="block text-white hover:bg-blue-500 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/faq" 
                  className="block text-white hover:bg-blue-500 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link 
                  href="/dashboard" 
                  className="block text-white hover:bg-blue-500 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout(); // ✅ Call handleLogout instead of logout directly
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-white hover:bg-red-500 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block text-white hover:bg-blue-500 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block text-white hover:bg-blue-500 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
