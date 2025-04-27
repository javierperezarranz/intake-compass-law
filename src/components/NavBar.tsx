
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-lawfirm border-b border-lawfirm-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/manage" className="text-white hover:text-lawfirm-primary px-3 py-2 rounded-md text-sm font-medium">
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'law-firm' && user.firmSlug && (
                  <Link to={`/${user.firmSlug}/back/leads`} className="text-white hover:text-lawfirm-primary px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-white hover:text-lawfirm-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-lawfirm-primary px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link to="/signup" className="bg-lawfirm-primary hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
