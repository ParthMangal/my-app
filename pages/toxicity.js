import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Toxicity({ userData }) {
  const { user, logout } = useAuth();
  const [file, setFile] = useState(null);
  const [smiles, setSmiles] = useState('');
  const [toxicityType, setToxicityType] = useState('ML_Model');
  const [toxicThreshold, setToxicThreshold] = useState('0.7');
  const [moderateThresholdMin, setModerateThresholdMin] = useState('0.3');
  const [moderateThresholdMax, setModerateThresholdMax] = useState('0.7');
  const [nonToxicThreshold, setNonToxicThreshold] = useState('0.3');
  const [category, setCategory] = useState('toxicity');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [email, setEmail] = useState(userData.email || '');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    if (!userData.email) {
      setEmailMessage('Please provide an email to receive toxicity results.');
    } else {
      setEmailMessage('');
    }
  }, [userData.email]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSmiles('');
  };

  const handleSmilesChange = (e) => {
    setSmiles(e.target.value);
    setFile(null);
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setEmailMessage('Please enter a valid email address.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/update_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setEmailMessage('Email updated successfully.');
        setTimeout(() => window.location.reload(), 1000); // Refresh to update userData
      } else {
        setEmailMessage(data.error || 'Failed to update email.');
      }
    } catch (error) {
      setEmailMessage('Error updating email: Network issue.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setResults(null);
    setDownloadLinks([]);

    if (!userData.email && !email) {
      setMessage('Please update your email before running predictions.');
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (smiles) {
      formData.append('smiles', smiles);
    }
    formData.append('toxicity_type', toxicityType);
    formData.append('toxic_threshold', toxicThreshold);
    formData.append('moderate_threshold_min', moderateThresholdMin);
    formData.append('moderate_threshold_max', moderateThresholdMax);
    formData.append('non_toxic_threshold', nonToxicThreshold);
    formData.append('category', category);

    try {
      const response = await fetch('http://localhost:5000/run_toxai/run_toxicity', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setResults(data.values);
        // setDownloadLinks(data.download_link);
      } else {
        setMessage(data.error || 'Failed to run toxicity prediction.');
      }
    } catch (error) {
      setMessage('Error running toxicity prediction: Network issue.');
    }
  };

  if (!user) {
    return <p>Please log in.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Toxicity Tool</h1>
      {!userData.email && (
        <div>
          <h3>Update Email</h3>
          <form onSubmit={handleEmailUpdate}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '8px', margin: '10px 0' }}
              required
            />
            <button type="submit" style={{ padding: '10px 20px' }}>
              Update Email
            </button>
          </form>
          {emailMessage && (
            <p style={{ color: emailMessage.includes('success') ? 'green' : 'red' }}>
              {emailMessage}
            </p>
          )}
        </div>
      )}
      <h3>Run Toxicity Prediction</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload File:</label>
          <input
            type="file"
            accept=".smi,.csv,.txt"
            onChange={handleFileChange}
            style={{ margin: '10px 0' }}
            disabled={smiles !== ''}
          />
        </div>
        <div>
          <label>SMILES (comma-separated):</label>
          <input
            type="text"
            value={smiles}
            onChange={handleSmilesChange}
            placeholder="e.g., c1ccccc1,C(=O)O"
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
            disabled={file !== null}
          />
        </div>
        <div>
          <label>Model:</label>
          <select
            value={toxicityType}
            onChange={(e) => setToxicityType(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          >
            <option value="ML_Model">ML Model</option>
            <option value="Deep_Model">Deep Model</option>
          </select>
        </div>
        <div>
          <label>Toxic Threshold (0-1):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={toxicThreshold}
            onChange={(e) => setToxicThreshold(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Moderate Threshold Min (0-1):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={moderateThresholdMin}
            onChange={(e) => setModerateThresholdMin(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Moderate Threshold Max (0-1):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={moderateThresholdMax}
            onChange={(e) => setModerateThresholdMax(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Non-Toxic Threshold (0-1):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={nonToxicThreshold}
            onChange={(e) => setNonToxicThreshold(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., toxicity"
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }} disabled={!userData.email}>
          Run Toxicity Prediction
        </button>
      </form>
      {message && (
        <p style={{ color: message.includes('success') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
      {results && (
        <div>
          <h3>Results</h3>
          <p>Toxic Count: {results[0]}</p>
          <p>Moderate Count: {results[1]}</p>
          <p>Non-Toxic Count: {results[2]}</p>
        </div>
      )}
      {downloadLinks.length > 0 && (
        <div>
          <h3>Download Results</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href={downloadLinks[0]} style={{ color: '#0070f3' }}>All Results</a></li>
            <li><a href={downloadLinks[1]} style={{ color: '#0070f3' }}>Toxic Results</a></li>
            <li><a href={downloadLinks[2]} style={{ color: '#0070f3' }}>Moderate Results</a></li>
            <li><a href={downloadLinks[3]} style={{ color: '#0070f3' }}>Non-Toxic Results</a></li>
          </ul>
        </div>
      )}
      <h3>Navigate Tools</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link href="/categories">Categories Tool</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link href="/jobs">Jobs Tool</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link href="/results">Results Tool</Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link href="/profile">Profile Tool</Link>
        </li>
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