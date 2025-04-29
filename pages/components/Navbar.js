import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      background: '#0070f3',
      padding: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      <div>
        <Link href="/dashboard" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link href="/categories" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
          Categories
        </Link>
        <Link href="/jobs" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
          Jobs
        </Link>
        <Link href="/results" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
          Results
        </Link>
        <Link href="/profile" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
          Profile
        </Link>
      </div>
      <button
        onClick={handleLogout}
        style={{ background: 'white', color: '#0070f3', padding: '5px 10px', border: 'none', borderRadius: '4px' }}
      >
        Logout
      </button>
    </nav>
  );
}