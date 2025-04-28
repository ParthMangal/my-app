import { useAuth } from '../context/AuthContext';

export default function Categories({ categories }) {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Categories Tool</h1>
      <h3>Your Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name} (Created: {new Date(cat.created_at).toLocaleString()})</li>
        ))}
      </ul>
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
    const response = await fetch('http://localhost:5000/api/categories', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    const categories = await response.json();

    if (!response.ok) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: { categories },
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