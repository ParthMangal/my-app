import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';

export default function Results({ results }) {
  const { user, logout } = useAuth();
  const [newResult, setNewResult] = useState('');
  const [message, setMessage] = useState('');

  const handleAddResult = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: newResult }),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Result added successfully!');
      setNewResult('');
      window.location.reload(); // Refresh to show new result
    } else {
      setMessage(data.error || 'Failed to add result');
    }
  };

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Results Tool</h1>
      <h3>Navigate Tools</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#0070f3' }}>
            Dashboard
          </Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link href="/categories" style={{ textDecoration: 'none', color: '#0070f3' }}>
            Categories Tool
          </Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link href="/jobs" style={{ textDecoration: 'none', color: '#0070f3' }}>
            Jobs Tool
          </Link>
        </li>
      </ul>
      <h3>Your Results</h3>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name} (Created: {new Date(result.created_at).toLocaleString()})</li>
        ))}
      </ul>
      <h3>Add New Result</h3>
      <form onSubmit={handleAddResult}>
        <input
          type="text"
          value={newResult}
          onChange={(e) => setNewResult(e.target.value)}
          placeholder="Enter result"
          style={{ width: '100%', padding: '8px', margin: '8px 0' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Add Result
        </button>
      </form>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <button
        onClick={logout}
        style={{ padding: '10px 20px', marginTop: '20px' }}
      >
        Logout
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch('http://localhost:5000/api/results', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    const results = await response.json();

    if (!response.ok) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: { results },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}