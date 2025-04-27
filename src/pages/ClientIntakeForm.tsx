
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';

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
  const [isValidFirm, setIsValidFirm] = useState<boolean | null>(null);
  const [firmName, setFirmName] = useState<string>('');
  
  // Check if the firm exists
  useEffect(() => {
    const checkFirmExists = async () => {
      if (!slug) {
        setIsValidFirm(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('firms')
          .select('name')
          .eq('slug', slug)
          .single();
          
        if (error || !data) {
          console.error('Error checking firm:', error);
          setIsValidFirm(false);
          return;
        }
        
        setFirmName(data.name);
        setIsValidFirm(true);
      } catch (err) {
        console.error('Error checking firm:', err);
        setIsValidFirm(false);
      }
    };
    
    checkFirmExists();
  }, [slug]);

  // Return not found if the firm doesn't exist or we're still loading
  if (isValidFirm === false) {
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
      // Get firm_id from the slug
      const { data: firmData, error: firmError } = await supabase
        .from('firms')
        .select('firm_id')
        .eq('slug', slug)
        .single();
      
      if (firmError || !firmData) {
        throw new Error('Could not find law firm');
      }
      
      // Submit lead to database
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          firm_id: firmData.firm_id
        });
        
      if (leadError) {
        throw new Error('Failed to submit information');
      }
      
      setSubmitted(true);
      toast.success('Your information has been submitted!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking if firm exists
  if (isValidFirm === null) {
    return (
      <div className="law-app-bg min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    );
  }

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
    <div className="bg-[#050d1f] min-h-screen flex flex-col">
      <header className="bg-[#0a1426] border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-500 text-white rounded h-8 w-8 flex items-center justify-center mr-2">LS</div>
            <span className="text-white text-xl font-semibold">LawScheduling</span>
          </div>
          <div className="space-x-6">
            <a href={`/${slug}/intake`} className="text-blue-400 hover:text-blue-300">Client Intake</a>
            <a href="/dashboard" className="text-gray-400 hover:text-gray-300">Dashboard</a>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#0a1426] border border-gray-800 rounded-lg shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="text-blue-500 mb-2">Consultation Request</div>
            <h1 className="text-2xl font-bold text-white">Request a consultation with our firm</h1>
            <p className="text-gray-400 mt-2">
              Please fill out the form below and our team will contact you shortly to schedule your consultation.
            </p>
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
                className="bg-[#0c1a2e] border border-gray-700 text-white rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-[#0c1a2e] border border-gray-700 text-white rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-[#0c1a2e] border border-gray-700 text-white rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md w-full py-3 transition duration-200"
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
              ) : 'Submit Information'}
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
