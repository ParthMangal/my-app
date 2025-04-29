import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '10px', background: '#f0f0f0' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        {user && (
          <>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/jobs">Jobs</Link></li>
            <li><Link href="/results">Results</Link></li>
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/toxicity">Toxicity</Link></li>
            <li>
              <button onClick={logout} style={{ padding: '5px 10px' }}>
                Logout
              </button>
            </li>
          </>
        )}
        {!user && <li><Link href="/login">Login</Link></li>}
      </ul>
    </nav>
  );
}