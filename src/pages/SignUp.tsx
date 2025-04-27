
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

const SignUp = () => {
  const { user, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [firmSlug, setFirmSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firmName?: string;
    firmSlug?: string;
  }>({});

  // If already logged in, redirect to appropriate page
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/manage" />;
    } else if (user.firmSlug) {
      return <Navigate to={`/${user.firmSlug}/back/leads`} />;
    }
  }

  const validateSlug = (slug: string) => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  };

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
      firmName?: string;
      firmSlug?: string;
    } = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!firmName) newErrors.firmName = 'Firm name is required';
    
    if (!firmSlug) newErrors.firmSlug = 'Firm URL is required';
    else if (!validateSlug(firmSlug)) {
      newErrors.firmSlug = 'URL can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await signUp(email, password, firmName, firmSlug);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle slug input to enforce valid characters
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFirmSlug(value);
  };

  return (
    <div className="law-app-bg flex flex-col min-h-screen">
      <div className="p-6">
        <Logo linkTo="/" />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="auth-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-gray-400 mt-2">Sign up to start growing your law practice</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="law-input"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="law-input"
                placeholder="Create a password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="firmName" className="block text-sm font-medium text-gray-300 mb-1">
                Law Firm Name
              </label>
              <input
                id="firmName"
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="law-input"
                placeholder="Your law firm name"
              />
              {errors.firmName && <p className="mt-1 text-sm text-red-500">{errors.firmName}</p>}
            </div>
            
            <div>
              <label htmlFor="firmSlug" className="block text-sm font-medium text-gray-300 mb-1">
                Unique law firm URL
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-lawfirm text-gray-400 sm:text-sm">
                  lawscheduling.com/
                </span>
                <input
                  id="firmSlug"
                  type="text"
                  value={firmSlug}
                  onChange={handleSlugChange}
                  className="law-input rounded-l-none"
                  placeholder="your-firm-name"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Example: lawscheduling.com/law-firm-name. The name may only contain lowercase alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
              </p>
              {errors.firmSlug && <p className="mt-1 text-sm text-red-500">{errors.firmSlug}</p>}
            </div>
            
            <button
              type="submit"
              className="law-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </span>
              ) : 'Sign up'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="law-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
