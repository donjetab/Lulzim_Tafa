import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Component, useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Testimonials from './pages/Testimonials.jsx';
import Books from './pages/Books.jsx';
import Poetry from './pages/Poetry.jsx';
import PoetryDetails from './pages/PoetryDetails.jsx';
import PoetryVideoDetails from './pages/PoetryVideoDetails.jsx';
import PoetryHouse from './pages/PoetryHouse.jsx';
import News from './pages/News.jsx';
import NewsDetails from './pages/NewsDetails.jsx';
import Gallery from './pages/Gallery.jsx';
import Awards from './pages/Awards.jsx';
import AwardDetails from './pages/AwardDetails.jsx';
import Admin from './pages/Admin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (['5173', '5174'].includes(window.location.port) ? `${window.location.protocol}//${window.location.hostname}:5000` : '');

class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="admin-login-shell">
          <section className="admin-login-panel">
            <div>
              <p>Admin error</p>
              <h1>Could not open admin</h1>
            </div>
            <pre className="admin-route-error">{this.state.error.message}</pre>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

function ProtectedAdminRoute() {
  const [authState, setAuthState] = useState('checking');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function checkAdminSession() {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
        if (!response.ok) throw new Error(`Auth check failed with ${response.status}.`);
        const data = await response.json();
        if (isMounted) setAuthState(data.isAuthenticated ? 'authenticated' : 'anonymous');
      } catch (error) {
        if (isMounted) {
          setAuthError(error.message);
          setAuthState('anonymous');
        }
      }
    }

    checkAdminSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState === 'checking') {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-panel" aria-live="polite">
          <div>
            <p>Secure admin</p>
            <h1>Checking session</h1>
          </div>
        </section>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="admin-login-shell">
        <section className="admin-login-panel">
          <div>
            <p>Secure admin</p>
            <h1>Login check failed</h1>
          </div>
          <pre className="admin-route-error">{authError}</pre>
        </section>
      </main>
    );
  }

  if (authState !== 'authenticated') return <Navigate to="/" replace />;

  return (
    <AdminErrorBoundary>
      <Admin />
    </AdminErrorBoundary>
  );
}

function LegacyPublicRoute() {
  const location = useLocation();
  const { language } = useLanguage();
  const destination = `/${language}${location.pathname === '/' ? '' : location.pathname}${location.search}${location.hash}`;
  return <Navigate to={destination} replace />;
}

function LocalizedLayout() {
  const { lang } = useParams();
  if (lang !== 'en' && lang !== 'sq') return <Navigate to="/en" replace />;
  return <Layout />;
}

export default function App() {
  return (
    <LanguageProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />
        <Route path="/:lang" element={<LocalizedLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="rreth" element={<About />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="vleresime" element={<Testimonials />} />
          <Route path="books" element={<Books />} />
          <Route path="librat" element={<Books />} />
          <Route path="books/:slug" element={<Navigate to="../" replace />} />
          <Route path="librat/:slug" element={<Navigate to="../" replace />} />
          <Route path="poetry" element={<Poetry />} />
          <Route path="poezi" element={<Poetry />} />
          <Route path="poetry/video" element={<Poetry />} />
          <Route path="poezi/video" element={<Poetry />} />
          <Route path="poetry/video/:slug" element={<PoetryVideoDetails />} />
          <Route path="poezi/video/:slug" element={<PoetryVideoDetails />} />
          <Route path="poetry/:slug" element={<PoetryDetails />} />
          <Route path="poezi/:slug" element={<PoetryDetails />} />
          <Route path="poetry-house" element={<PoetryHouse />} />
          <Route path="shtepia-e-poezise" element={<PoetryHouse />} />
          <Route path="news" element={<News />} />
          <Route path="lajme" element={<News />} />
          <Route path="news/:slug" element={<NewsDetails />} />
          <Route path="lajme/:slug" element={<NewsDetails />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="galeria" element={<Gallery />} />
          <Route path="awards" element={<Awards />} />
          <Route path="cmimet" element={<Awards />} />
          <Route path="awards/:slug" element={<AwardDetails />} />
          <Route path="cmimet/:slug" element={<AwardDetails />} />
        </Route>
        <Route path="*" element={<LegacyPublicRoute />} />
      </Routes>
    </LanguageProvider>
  );
}
