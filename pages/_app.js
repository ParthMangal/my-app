import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}