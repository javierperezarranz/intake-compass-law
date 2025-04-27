
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NavBar from '@/components/NavBar';

const LawFirmPage = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="law-app-bg min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Direct Mail website of Law Firm
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300">
            Try out the form that your clients will fill out and manage your account
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              to={`/${slug}/intake`}
              className="group bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              Try client form
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/login"
              className="bg-lawfirm-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              Log in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-gray-400">
        <p>© 2025 LawScheduling. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LawFirmPage;
