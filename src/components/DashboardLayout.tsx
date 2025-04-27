
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { logout } = useAuth();

  return (
    <div className="law-app-bg min-h-screen">
      <DashboardSidebar />
      
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <button 
            onClick={logout}
            className="text-white bg-lawfirm-muted hover:bg-lawfirm/70 px-4 py-2 rounded-md text-sm"
          >
            Log out
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
