import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock,
  BookOpen 
} from 'lucide-react';

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null); // For capturing raw API responses in case of errors
  
    /**
   * ENVIRONMENT CONFIGURATION
   * We use a safe access pattern for Vite environment variables to prevent
   * compilation warnings in restricted target environments.
   */
  const getEnvVar = (key, fallback = '') => {
    try {
      // Accessing via bracket notation to avoid static analysis issues in some environments
      const meta = import.meta;
      const env = meta && meta.env ? meta.env : {};
      return env[key] || fallback;
      //return import.meta.env[key] || fallback;
    } catch (e) {
      return fallback;
    }
  };

  //const [errorMessage, setErrorMessage] = useState(null); 
  //const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const APP_MODE = getEnvVar('MODE', 'production');
  const REGISTRATION_API = `${API_BASE_URL}/users/register`;

    // DIAGNOSTIC LOGGING
  useEffect(() => {
    // Safely check for the variable to avoid the build-time warning/error
    const rawBaseUrl = getEnvVar('VITE_API_BASE_URL');
    
    console.log("--- API DIAGNOSTICS ---");
    console.log("VITE_API_BASE_URL Value:", rawBaseUrl);
    console.log("Constructed Registration API Path:", REGISTRATION_API);
    
    if (REGISTRATION_API.includes('<') || REGISTRATION_API.includes('>')) {
      console.error("CRITICAL: API URL contains placeholders. Build-time injection failed.");
      setErrorMessage("System Configuration Error: API URL is malformed (placeholders detected).");
    }
  }, [REGISTRATION_API]);



  // Generic handler for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(null);
    setSubmissionSuccess(false);
  };

  // Simulating the submission process without a database
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    
    setIsSaving(true);
    setErrorMessage(null);
    setSubmissionSuccess(false);

    console.log('Attempting registration at:', REGISTRATION_API);
    try {
      const response = await fetch(REGISTRATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          emailId: formData.email,
          password: formData.password,
          courseOpted: formData.program
        })
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      
      if (isJson) {
        const data = await response.json();
        if (response.ok) {
          setSubmissionSuccess(true);
          setFormData(initialFormData);
        } else {
          setErrorMessage(data.message || `API Error: ${response.status}`);
        }
      } else {
        console.log("Routing Error: Received HTML instead of JSON. The request likely hit S3 instead of the API.");
        // This handles the "False 200" scenario where HTML is returned instead of JSON
        const rawText = await response.text();
        const snippet = rawText.substring(0, 200); // Capture start of HTML for debugging
        
        setErrorMessage(`Infrastructure Error: Expected JSON but received HTML. The VPC Link or Gateway might be misconfigured.`);
        setDebugInfo(snippet);
        console.error("Non-JSON response received:", rawText);
      }
       
    } catch (err) {
      console.error("API Submission Error:", err);
      setErrorMessage(err.message);
    } finally {
      setIsSaving(false);
    }

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
            Mode: <em className="text-sm text-gray-400">{APP_MODE}</em>
          </p>
        </header>

        {errorMessage && (
          <div className="p-4 mb-6 text-sm font-semibold text-white bg-rose-500 rounded-xl shadow-lg flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </div>
        )}

        
        {submissionSuccess && (
          <div className="p-4 mb-6 text-sm font-semibold text-white bg-emerald-500 rounded-xl shadow-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Successfully submitted to the API!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <User size={18} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="E.g., Priya Sharma"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Mail size={18} strokeWidth={2.5} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E.g., priya.sharma@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={18} strokeWidth={2.5} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          {/* Select Program */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Select Program</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <BookOpen size={18} strokeWidth={2.5} />
              </div>
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="IT Career Accelerator (6 Months)">IT Career Accelerator (6 Months)</option>
                <option value="Cloud Engineering (1 Year)">Cloud Engineering (1 Year)</option>
                <option value="Data Science Bootcamp (8 Months)">Data Science Bootcamp (8 Months)</option>
              </select>
            </div>
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out ${
              isSaving ? 'bg-indigo-400 cursor-not-allowed flex items-center justify-center' : 'bg-indigo-600 hover:bg-indigo-700'
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
