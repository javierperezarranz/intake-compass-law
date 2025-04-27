
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

interface IntakeFormData {
  fullName: string;
  email: string;
  phone: string;
}

const ClientIntakeForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const [formData, setFormData] = useState<IntakeFormData>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock data for demo purposes - in a real app this would validate against a database
  const validFirmSlugs = ['demo', 'test-firm'];
  if (!slug || !validFirmSlugs.includes(slug)) {
    return <Navigate to="/not-found" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      phone?: string;
    } = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitted(true);
      toast.success('Your information has been submitted!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show success message after submission
  if (submitted) {
    return (
      <div className="law-app-bg min-h-screen flex flex-col">
        <div className="p-6">
          <Logo linkTo="/" />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="auth-card text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Thank You!</h1>
            <p className="text-gray-300 mb-6">
              Your information has been submitted successfully. A representative will contact you shortly.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="law-btn-primary"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="law-app-bg min-h-screen flex flex-col">
      <div className="p-6">
        <Logo linkTo="/" />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="auth-card w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">{slug === 'demo' ? 'Demo Law Firm' : 'Test Firm'} Intake Form</h1>
            <p className="text-gray-400 mt-2">Please fill out this form to get in touch with our team</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name*
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="law-input"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="law-input"
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number*
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="law-input"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <button
              type="submit"
              className="law-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit'}
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientIntakeForm;
