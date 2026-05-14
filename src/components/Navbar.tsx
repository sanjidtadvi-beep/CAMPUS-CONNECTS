import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { LogOut, User as UserIcon, Menu, X, Terminal } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, club } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-black italic tracking-tighter text-white flex items-center gap-2 uppercase">
          <div className="w-9 h-9 bg-white text-black rounded-xl flex items-center justify-center">
            <span className="text-lg font-black leading-none">C</span>
          </div>
          Campus Connects
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 hover:text-primary transition-all">Home</Link>
          <Link to="/#clubs" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-all">Clubs</Link>
          <Link to="/#events" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-all">Events</Link>
          
          <div className="w-[1px] h-6 bg-border mx-2" />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 bg-secondary border border-border rounded-full hover:bg-zinc-900 transition-all flex items-center gap-2 active-scale">
                <UserIcon size={14} className="text-primary" />
                {club?.name || 'Club Admin'}
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-muted-foreground hover:text-red-500 transition-all active-scale"
                title="Disconnect"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/admin" className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active-scale">
              Club Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border px-6 py-10 flex flex-col gap-8 overflow-hidden"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-white">Home</Link>
            <Link to="/#clubs" onClick={() => setIsOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Club Directory</Link>
            <Link to="/#events" onClick={() => setIsOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Upcoming Events</Link>
            
            <div className="w-full h-px bg-border" />
            
            {user ? (
              <div className="flex flex-col gap-6">
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <UserIcon size={14} /> Admin Portal
                </Link>
                <button onClick={handleLogout} className="text-left text-xs font-black uppercase tracking-[0.3em] text-red-500">Sign Out</button>
              </div>
            ) : (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="py-4 bg-white text-black rounded-2xl text-center text-[10px] font-black uppercase tracking-widest italic">
                Get Started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
