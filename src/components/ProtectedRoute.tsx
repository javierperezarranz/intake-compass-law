import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const params = useParams<{ slug?: string }>();
  
  // Show loading state
  if (loading) {
    return (
      <div className="law-app-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-lawfirm-primary mx-auto" />
          <p className="mt-4 text-lawfirm-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For admin routes
  if (requireAdmin && user.role !== 'admin') {
    toast.error("You don't have permission to access this area");
    return <Navigate to="/" replace />;
  }

  // For law firm routes, check if there's a slug parameter
  if (params.slug) {
    // If user is a lawyer, check if they belong to the requested firm
    if (user.role === 'lawyer') {
      if (!user.firmSlug) {
        console.error('Lawyer user has no associated firm slug:', user.id);
        toast.error('Your account is not properly associated with a law firm');
        return <Navigate to="/" replace />;
      }
      
      if (user.firmSlug !== params.slug) {
        console.log(`Slug mismatch: URL has ${params.slug}, user belongs to ${user.firmSlug}`);
        toast.error("You don't have permission to access this firm's dashboard");
        return <Navigate to={`/${user.firmSlug}/back/leads`} replace />;
      }
    }
    
    // If user is an admin, they can access any firm's dashboard
    // No redirection needed for admins
  }

  return <>{children}</>;
};

export default ProtectedRoute;
