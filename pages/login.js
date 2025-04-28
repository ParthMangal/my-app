import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (await login(username, password)) {
      router.push('/categories');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>
          Login
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link href="/register" style={{ color: '#0070f3', textDecoration: 'none' }}>
          Register
        </Link>
      </p>
    </div>
  );
}