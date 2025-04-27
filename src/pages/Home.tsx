
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="law-app-bg">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Grow your law practice with<br />
            targeted direct mail
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with potential clients who need your legal services using our
            compliant, data-driven direct mail campaigns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-lawfirm-primary hover:bg-blue-600 text-white px-8 py-3 rounded-md text-base font-medium transition-colors"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="bg-lawfirm-muted hover:bg-gray-700 text-white px-8 py-3 rounded-md text-base font-medium transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Practice Areas Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Targeted Direct Mail for Every Practice Area
          </h2>
          <p className="text-gray-300 text-center mb-12">
            Our direct mail programs are tailored to reach the right clients at the right time.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-lawfirm-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Family Law</h3>
              <p className="text-gray-300">
                Reach individuals going through major life changes who may need family law services.
              </p>
            </div>
            
            <div className="bg-lawfirm-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Criminal Defense</h3>
              <p className="text-gray-300">
                Connect with potential clients who may need representation for criminal matters.
              </p>
            </div>
            
            <div className="bg-lawfirm-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Real Estate Law</h3>
              <p className="text-gray-300">
                Target new homeowners and property investors who need legal guidance.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300 text-center mb-12">
            Everything you need to know about our direct mail service for law firms.
          </p>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-lawfirm-muted p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">How do you source your data?</h3>
              <p className="text-gray-300">
                We use publicly available data from court records, property transactions, and other legal sources to identify individuals who may need legal services.
              </p>
            </div>
            
            <div className="bg-lawfirm-muted p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Is this service compliant with bar regulations?</h3>
              <p className="text-gray-300">
                Yes, our direct mail campaigns are designed to comply with all state bar regulations regarding attorney advertising and client solicitation.
              </p>
            </div>
            
            <div className="bg-lawfirm-muted p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">How does the pricing work?</h3>
              <p className="text-gray-300">
                Our service is pay-per-lead, meaning you only pay for potential clients who respond to your direct mail campaign. There are no long-term commitments, and you can cancel anytime.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to grow your practice?
          </h2>
          <p className="text-gray-300 mb-8">
            Sign up today and start receiving qualified leads through our direct mail campaigns.
          </p>
          <Link
            to="/signup"
            className="bg-lawfirm-primary hover:bg-blue-600 text-white px-8 py-3 rounded-md text-base font-medium inline-flex items-center"
          >
            Sign up now →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-lawfirm-muted py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="bg-lawfirm-primary text-white font-bold p-1 rounded mr-2">LS</span>
            <span className="font-semibold text-white">LawScheduling</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2023 LawScheduling. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
