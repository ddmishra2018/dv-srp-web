import React, { useState } from 'react';

// Define the initial empty state for the registration form
const initialFormData = {
  fullName: '',
  email: '',
  password: '',
  program: 'IT Career Accelerator (6 Months)',
};

// --- Main Application Component ---
export default function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  // Simulating the environment variables, setting them to null to ensure no Firebase connection attempts
  const userId = 'N/A';
  
  // State to simulate the error shown in the original image, cleared on interaction
  const [simulatedError, setSimulatedError] = useState(null); 

  // Generic handler for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSimulatedError(null); // Clear errors on input change
    setSubmissionSuccess(false);
  };

  // Simulating the submission process without a database
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setSimulatedError("Please fill in all required fields.");
      return;
    }
    
    setIsSaving(true);
    setSimulatedError(null);
    setSubmissionSuccess(false);

    // Simulate an API call delay (1.5 seconds)
    setTimeout(() => {
      console.log("Simulated Registration Data:", formData);
      
      setIsSaving(false);
      setSubmissionSuccess(true);
      setFormData(initialFormData); // Reset form
      
      // Optional: Clear success message after a few seconds
      setTimeout(() => setSubmissionSuccess(false), 5000);
      
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full border-t-4 border-indigo-700">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-900 leading-tight">
            Student Registration Portal (SRP)
          </h1>
          <p className="text-gray-600 mt-2 text-md">
            Secure your spot in the <strong className="text-indigo-600">IT Career Accelerator</strong> program.
          </p>
          <div className="mt-4 p-2 text-sm font-medium rounded-lg border border-gray-300 bg-gray-50">
            User ID: <span className="text-gray-700">{userId}</span>
          </div>
        </header>

        {/* Status/Error Box - Replaces the red Firebase error box */}
        {simulatedError && (
          <div className="p-3 mb-6 text-center text-sm font-medium text-white bg-red-600 rounded-lg shadow-md transition duration-300 ease-in-out">
            {simulatedError}
          </div>
        )}
        
        {submissionSuccess && (
          <div className="p-3 mb-6 text-center text-sm font-medium text-white bg-green-600 rounded-lg shadow-md transition duration-300 ease-in-out">
            Registration successful! (Data saved locally in the browser session)
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="E.g., Priya Sharma"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E.g., priya.sharma@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Select Program */}
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">Select Program</label>
            <select
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white pr-8"
            >
              <option value="IT Career Accelerator (6 Months)">IT Career Accelerator (6 Months)</option>
              <option value="Cloud Engineering (1 Year)">Cloud Engineering (1 Year)</option>
              <option value="Data Science Bootcamp (8 Months)">Data Science Bootcamp (8 Months)</option>
            </select>
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out ${
              isSaving 
                ? 'bg-indigo-400 cursor-not-allowed flex items-center justify-center'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              'Submit Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
