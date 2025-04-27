
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout, Settings } from 'lucide-react';

const DashboardSidebar = () => {
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  if (!user || !slug) return null;

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="w-64 bg-lawfirm-muted h-screen py-8 px-4 fixed left-0 top-0 overflow-y-auto">
      <div className="mb-8 px-4">
        <Link to="/" className="text-xl font-bold text-white">
          <div className="flex items-center">
            <span className="bg-lawfirm-primary text-white font-bold p-1 rounded mr-2">LS</span>
            <span className="font-semibold truncate">{user.firmName || 'Law Firm'}</span>
          </div>
        </Link>
      </div>
      
      <nav className="space-y-2">
        <Link 
          to={`/${slug}/back/leads`}
          className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            isActive('/leads') 
              ? 'bg-lawfirm-primary text-white' 
              : 'text-gray-300 hover:bg-lawfirm/70 hover:text-white'
          }`}
        >
          <Layout className="mr-3 h-5 w-5" />
          Leads
        </Link>
        
        <Link 
          to={`/${slug}/back/account`}
          className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            isActive('/account') 
              ? 'bg-lawfirm-primary text-white' 
              : 'text-gray-300 hover:bg-lawfirm/70 hover:text-white'
          }`}
        >
          <Settings className="mr-3 h-5 w-5" />
          Account Settings
        </Link>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
