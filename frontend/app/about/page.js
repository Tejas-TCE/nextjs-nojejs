"use client";
import ProtectedRoute from "../../components/ProtectedRoute";

const About = () => {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">About OneBoss</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At OneBoss, we're dedicated to revolutionizing the way businesses manage their operations. 
              Our platform provides a seamless, intuitive solution for businesses of all sizes to streamline 
              their processes and achieve greater efficiency.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-6">
              We envision a future where every business has access to powerful, user-friendly tools that 
              help them grow and succeed. OneBoss is committed to continuous innovation and improvement 
              to meet the evolving needs of our users.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li className="mb-2">Innovation: We constantly strive to develop cutting-edge solutions</li>
              <li className="mb-2">Reliability: We provide dependable tools that businesses can count on</li>
              <li className="mb-2">Security: We prioritize the protection of our users' data</li>
              <li className="mb-2">User-First: We design our solutions with our users in mind</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-600 mb-6">
              Our team consists of passionate professionals dedicated to delivering the best possible 
              experience for our users. We combine expertise in technology, business, and user experience 
              to create solutions that make a difference.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Have questions or suggestions? We'd love to hear from you. Reach out to us at{" "}
              <a href="mailto:contact@oneboss.com" className="text-blue-600 hover:underline">
                contact@oneboss.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default About; 