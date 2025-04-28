import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Dashboard({ userData }) {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Welcome, {userData.username}</h1>
      <h3>Your Tools</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
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
        <li style={{ margin: '10px 0' }}>
          <Link href="/results" style={{ textDecoration: 'none', color: '#0070f3' }}>
            Results Tool
          </Link>
        </li>
      </ul>
      <h3>Overview</h3>
      <p>Categories: {userData.categories.length}</p>
      <p>Jobs: {userData.jobs.length}</p>
      <p>Results: {userData.results.length}</p>
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
    const response = await fetch('http://localhost:5000/api/user', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    const userData = await response.json();

    if (!response.ok) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: { userData },
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