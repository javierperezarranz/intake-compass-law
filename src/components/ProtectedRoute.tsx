
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

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
    return <Navigate to="/" replace />;
  }

  // For law firm routes, check if the slug matches the user's firm
  if (params.slug && user.role === 'lawyer' && user.firmSlug !== params.slug) {
    console.log(`Slug mismatch: URL has ${params.slug}, user belongs to ${user.firmSlug}`);
    
    // If user has a firm slug, redirect them to their proper dashboard
    if (user.firmSlug) {
      return <Navigate to={`/${user.firmSlug}/back/leads`} replace />;
    }
    
    // If user doesn't have a firm slug, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
