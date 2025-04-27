
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  linkTo?: string;
}

const Logo = ({ size = 'medium', linkTo = '/' }: LogoProps) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  const content = (
    <div className="flex items-center">
      <span className="bg-lawfirm-primary text-white font-bold p-1 rounded mr-2">LS</span>
      <span className="font-semibold">LawScheduling</span>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={`${sizeClasses[size]} text-white hover:opacity-90 transition-opacity`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`${sizeClasses[size]} text-white`}>
      {content}
    </div>
  );
};

export default Logo;
