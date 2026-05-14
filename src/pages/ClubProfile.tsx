import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Share2, Mail, BadgeCheck } from 'lucide-react';
import { getClubById, getEventsByClubId } from '../services/firebaseService';
import { Club, Event } from '../types';
import { GlassCard, SectionHeader, FrostedButton } from '../components/ui/Layout';

export default function ClubProfile() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getClubById(id).then(setClub);
      const unsub = getEventsByClubId(id, (evs) => {
        setEvents(evs);
        setLoading(false);
      });
      return () => unsub();
    }
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!club) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Club not found.</div>;

  return (
    <div className="pt-20 min-h-screen bg-background text-foreground">
      {/* Banner & Profile Page Header */}
      <div className="border-b border-border">
        <div className="h-48 sm:h-64 md:h-80 w-full overflow-hidden relative bg-muted">
          <img 
            src={club.banner || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover opacity-80" 
            alt={club.name} 
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 sm:-mt-16 md:-mt-20 pb-10">
            <div className="relative p-1 bg-black rounded-2xl border border-border">
              <img 
                src={club.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80'} 
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl object-cover bg-black" 
                alt="logo" 
              />
            </div>
            <div className="flex-grow pt-4">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                  {club.name}
                </h1>
                <BadgeCheck className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest bg-secondary px-3 py-1 rounded-full border border-border">
                  <Mail size={12} className="text-primary" /> {club.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest bg-secondary px-3 py-1 rounded-full border border-border">
                  Verified Club
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* About Section */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <SectionHeader title="About Club" subtitle="Our mission and identity." className="mb-6" />
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-10 font-medium">
              {club.description || "No description provided. This club identity is still being formed."}
            </p>
            <div className="space-y-4">
              <FrostedButton variant="primary" className="w-full text-sm uppercase tracking-widest py-4">
                Message Club
              </FrostedButton>
              <FrostedButton variant="outline" className="w-full text-sm uppercase tracking-widest py-4">
                Follow Updates
              </FrostedButton>
            </div>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight">Events</h2>
              <span className="text-muted-foreground text-xs font-black bg-secondary px-3 py-1 rounded-full border border-border">{events.length} UPCOMING</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <GlassCard className="flex flex-col group border-border">
                    <Link to={`/event/${event.id}`} className="relative h-44 overflow-hidden bg-muted">
                      <img src={event.banner || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 opacity-90" />
                    </Link>
                    <div className="p-5">
                      <div className="flex flex-col gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-2"><Calendar size={12} className="text-primary" /> {event.date}</span>
                        <span className="flex items-center gap-2"><MapPin size={12} className="text-primary" /> {event.venue}</span>
                      </div>
                      <Link to={`/event/${event.id}`}>
                        <h3 className="text-lg font-extrabold text-white mb-6 group-hover:text-primary transition-colors line-clamp-1 italic">{event.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        <a 
                          href={event.registrationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-grow py-2.5 px-4 bg-white text-black font-black rounded-full text-xs hover:bg-zinc-200 transition-all text-center active-scale"
                        >
                          RSVP
                        </a>
                        <button className="p-2.5 bg-secondary border border-border rounded-full text-white hover:bg-zinc-800 transition-all active-scale">
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
            {events.length === 0 && (
              <div className="py-20 text-center border border-dashed border-border rounded-2xl bg-muted/10">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">No events listed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
