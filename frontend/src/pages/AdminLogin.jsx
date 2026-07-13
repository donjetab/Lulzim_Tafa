import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminLogo from '../assets/logo/logo_landscape.png';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (['5173', '5174'].includes(window.location.port) ? `${window.location.protocol}//${window.location.hostname}:5000` : '');

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
        const data = await response.json();
        if (isMounted) setIsAuthenticated(Boolean(data.isAuthenticated));
      } catch {
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function submitLogin(event) {
    event.preventDefault();
    setStatus('Signing in...');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Invalid username or password.');
      }

      navigate('/admin', { replace: true });
    } catch (error) {
      setStatus(error.message);
    }
  }

  if (isChecking) {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-panel" aria-live="polite">
          <img src={adminLogo} alt="Lulzim Tafa" />
          <div>
            <p>Secure admin</p>
            <h1>Checking session</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-login-shell">
      <form className="admin-login-panel" onSubmit={submitLogin}>
        <img src={adminLogo} alt="Lulzim Tafa" />
        <div>
          <p>Secure admin</p>
          <h1>Sign in</h1>
        </div>
        {isAuthenticated ? (
          <p className="admin-login-status">You are already signed in. You can open the dashboard or sign in again.</p>
        ) : null}
        <label>
          <span>Username</span>
          <input autoComplete="username" onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          <span>Password</span>
          <input
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {status ? <p className="admin-login-status">{status}</p> : null}
        <button type="submit">Log in</button>
        {isAuthenticated ? <button type="button" onClick={() => navigate('/admin')}>Open dashboard</button> : null}
      </form>
    </main>
  );
}
