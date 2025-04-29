import { useAuth } from '../context/AuthContext';

export default function Profile({ userData }) {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Profile Tool</h1>
      <h3>User Information</h3>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Categories Count:</strong> {userData.categories.length}</p>
      <p><strong>Jobs Count:</strong> {userData.jobs.length}</p>
      <p><strong>Results Count:</strong> {userData.results.length}</p>
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