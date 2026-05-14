import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { getClubs, getEvents } from '../services/firebaseService';
import { Club, Event } from '../types';
import { GlassCard, SectionHeader, FrostedButton } from '../components/ui/Layout';

export default function Home() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const unsubClubs = getClubs(setClubs);
    const unsubEvents = getEvents(setEvents);
    
    // GSAP Parallax
    if (heroTitleRef.current) {
      gsap.to(heroTitleRef.current, {
        y: 100,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    return () => {
      unsubClubs();
      unsubEvents();
    };
  }, []);

  const handleShare = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + '/event/' + event.id
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + '/event/' + event.id);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section ref={heroRef} className="relative px-6 py-20 sm:py-32 md:py-48 max-w-7xl mx-auto text-center border-b border-border">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="inline-block px-3 py-1 mb-6 bg-secondary border border-border rounded-full text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Campus Community
          </div>
          <h1 
            ref={heroTitleRef}
            className="text-4xl sm:text-6xl md:text-[92px] font-[900] tracking-tight text-white mb-6 sm:mb-10 leading-[1.05] uppercase"
          >
            Built for the <br />
            Next Generation
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 font-medium leading-relaxed px-4">
            A minimalist space for student communities, workshops, and high-impact events. 
            Connect with builders and creators across campus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/#events">
              <FrostedButton variant="primary" className="w-full sm:w-auto">
                Explore Events
              </FrostedButton>
            </Link>
            <Link to="/#clubs">
              <FrostedButton variant="outline" className="w-full sm:w-auto">
                Discover Clubs
              </FrostedButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border">
        {/* Clubs Column */}
        <section id="clubs" className="lg:col-span-4 px-6 py-12 sm:py-20">
          <SectionHeader 
            title="Communities" 
            subtitle="Explore featured student organizations." 
            className="mb-10"
          />

          <div className="space-y-6">
            {clubs.map((club, idx) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/club/${club.id}`} className="group block p-5 x-card hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={club.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80'} 
                      alt="logo" 
                      className="w-12 h-12 rounded-xl border border-border object-cover bg-black" 
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{club.name}</h3>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        Verified Club
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed font-medium">
                    {club.description}
                  </p>
                </Link>
              </motion.div>
            ))}
            {clubs.length === 0 && (
              <div className="py-10 text-center border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground text-xs">No communities listed yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Events Column */}
        <section id="events" className="lg:col-span-8 px-6 py-12 sm:py-20">
          <SectionHeader 
            title="What's Happening" 
            subtitle="The latest workshops, hackathons, and gatherings."
            className="mb-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, idx) => {
              const hostClub = clubs.find(c => c.id === event.clubId);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GlassCard className="h-full group hover:border-muted-foreground/30 shadow-none border-border">
                    <Link to={`/event/${event.id}`} className="relative block h-48 overflow-hidden bg-muted">
                      <img 
                        src={event.banner || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 opacity-90" 
                      />
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                        Live
                      </div>
                    </Link>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Link to={`/club/${hostClub?.id}`} className="text-[10px] font-bold uppercase text-primary tracking-widest hover:underline">
                          {hostClub?.name || 'Club'}
                        </Link>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {event.date}
                        </span>
                      </div>
                      <Link to={`/event/${event.id}`}>
                        <h3 className="text-lg font-extrabold text-white mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                      </Link>
                      <div className="text-muted-foreground text-xs mb-4 flex items-center gap-1.5 font-medium">
                        <MapPin size={12} className="text-muted-foreground" /> {event.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <a 
                          href={event.registrationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-grow py-2.5 px-4 bg-white text-black font-black rounded-full text-xs hover:bg-zinc-200 transition-all text-center active-scale"
                        >
                          REGISTER
                        </a>
                        <button 
                          onClick={() => handleShare(event)}
                          className="p-2.5 bg-secondary border border-border rounded-full text-white hover:bg-zinc-800 transition-all active-scale"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
            {events.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-border rounded-2xl bg-muted/20">
                <p className="text-muted-foreground text-sm font-medium">No events found. Check back soon.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border">
        <div className="flex items-center gap-2 text-xl font-black italic tracking-tighter text-white">
          <div className="w-6 h-6 bg-white text-black flex items-center justify-center rounded-sm">
            <span className="text-[10px]">C</span>
          </div>
          CAMPUS CONNECTS
        </div>
        <p className="text-muted-foreground text-xs font-medium">© 2026 CAMPUS CONNECTS. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6">
          <Link to="/admin" className="text-muted-foreground hover:text-white text-xs font-bold transition-colors uppercase">Admin Login</Link>
          <a href="#" className="text-muted-foreground hover:text-white text-xs font-bold transition-colors">PRIVACY</a>
        </div>
      </footer>
    </div>
  );
}
