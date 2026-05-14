import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClubProfile from './pages/ClubProfile';
import EventDetails from './pages/EventDetails';
import Admin from './pages/Admin';
import SmoothScroll from './components/SmoothScroll';
import SplashIntro from './components/SplashIntro';

// Scroll to top component
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <SplashIntro />
      <Router>
        <ScrollToTop />
        <SmoothScroll>
          <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/club/:id" element={<ClubProfile />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </SmoothScroll>
      </Router>
    </AuthProvider>
  );
}
