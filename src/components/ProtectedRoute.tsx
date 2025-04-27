
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const params = useParams<{ slug?: string }>();
  
  // Show loading state
  if (loading) {
    return (
      <div className="law-app-bg flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lawfirm-primary mx-auto"></div>
          <p className="mt-4 text-lawfirm-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For admin routes
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // For law firm routes, check if the slug matches the user's firm
  if (params.slug && user.role === 'law-firm' && user.firmSlug !== params.slug) {
    return <Navigate to={`/${user.firmSlug}/back/leads`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
