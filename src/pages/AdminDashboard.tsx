
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Logo from '@/components/Logo';
import { format } from 'date-fns';

// Mock data for law firms
const mockLawFirms = [
  {
    id: '1',
    email: 'demo@lawfirm.com',
    firmName: 'Demo Law Firm',
    firmSlug: 'demo',
    leadCount: 24,
    signedUpAt: new Date('2023-01-15T10:30:00'),
  },
  {
    id: '2',
    email: 'test@example.com',
    firmName: 'Test Firm LLC',
    firmSlug: 'test-firm',
    leadCount: 12,
    signedUpAt: new Date('2023-02-20T14:45:00'),
  },
  {
    id: '3',
    email: 'legal@smithjones.com',
    firmName: 'Smith & Jones',
    firmSlug: 'smith-jones',
    leadCount: 45,
    signedUpAt: new Date('2023-01-05T09:15:00'),
  },
  {
    id: '4',
    email: 'info@legalconsult.com',
    firmName: 'Legal Consultants Group',
    firmSlug: 'legal-consultants',
    leadCount: 31,
    signedUpAt: new Date('2023-03-10T16:20:00'),
  },
  {
    id: '5',
    email: 'admin@lawpartners.com',
    firmName: 'Law Partners Association',
    firmSlug: 'law-partners',
    leadCount: 18,
    signedUpAt: new Date('2023-02-28T11:40:00'),
  },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter law firms based on search term
  const filteredFirms = mockLawFirms.filter(firm => 
    firm.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.firmSlug.includes(searchTerm)
  );

  const formatDateTime = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const totalLeads = mockLawFirms.reduce((sum, firm) => sum + firm.leadCount, 0);
  const totalFirms = mockLawFirms.length;

  return (
    <ProtectedRoute requireAdmin>
      <div className="law-app-bg min-h-screen">
        <header className="bg-lawfirm-muted shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Logo />
            <button 
              onClick={logout}
              className="text-white hover:text-lawfirm-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Log out
            </button>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-lawfirm-muted rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-lawfirm-primary mb-2">Total Law Firms</h2>
              <p className="text-3xl font-bold text-white">{totalFirms}</p>
            </div>
            
            <div className="bg-lawfirm-muted rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-lawfirm-primary mb-2">Total Leads Generated</h2>
              <p className="text-3xl font-bold text-white">{totalLeads}</p>
            </div>
          </div>
          
          <div className="bg-lawfirm-muted rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">Law Firm Accounts</h2>
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search law firms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="law-input w-full sm:w-64"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Firm Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Signed Up
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredFirms.length > 0 ? (
                    filteredFirms.map((firm) => (
                      <tr key={firm.id} className="hover:bg-lawfirm/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {firm.firmName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {firm.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {firm.firmSlug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {firm.leadCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatDateTime(firm.signedUpAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-lawfirm-primary">
                          <Link to={`/${firm.firmSlug}/back/leads`} className="hover:underline">
                            View Dashboard
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">
                        No law firms found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
