
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { format } from 'date-fns';

// Mock data for leads
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    submittedAt: new Date('2023-04-26T14:32:00'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    submittedAt: new Date('2023-04-25T10:15:00'),
  },
  {
    id: '3',
    name: 'Michael Davis',
    email: 'mdavis@example.com',
    phone: '(555) 555-5555',
    submittedAt: new Date('2023-04-24T16:45:00'),
  },
  {
    id: '4',
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '(555) 222-3333',
    submittedAt: new Date('2023-04-23T09:20:00'),
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'rbrown@example.com',
    phone: '(555) 444-1111',
    submittedAt: new Date('2023-04-22T11:10:00'),
  },
];

const LeadsDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter leads based on search term
  const filteredLeads = mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  const formatDateTime = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <DashboardLayout title="Leads">
      <div className="bg-lawfirm-muted rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">Your Client Leads</h2>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search leads..."
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
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Submitted At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-lawfirm/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {lead.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatDateTime(lead.submittedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-400">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Your public intake form: {window.location.origin}/{slug}/intake
          </p>
          <p className="mt-2">
            Share this link with potential clients to collect their information.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadsDashboard;
