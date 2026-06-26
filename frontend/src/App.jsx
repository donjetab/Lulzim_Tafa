import { Navigate, Route, Routes } from 'react-router-dom';
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
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<Navigate to="/books" replace />} />
          <Route path="/poetry" element={<Poetry />} />
          <Route path="/poetry/video/:slug" element={<PoetryVideoDetails />} />
          <Route path="/poetry/:slug" element={<PoetryDetails />} />
          <Route path="/poetry-house" element={<PoetryHouse />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/awards/:slug" element={<AwardDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}
