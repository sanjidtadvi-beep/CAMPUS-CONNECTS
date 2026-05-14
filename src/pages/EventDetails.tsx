import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Share2, ArrowLeft, ExternalLink, User, BadgeCheck } from 'lucide-react';
import { getEventById, getClubById } from '../services/firebaseService';
import { Event, Club } from '../types';
import { GlassCard, SectionHeader, FrostedButton } from '../components/ui/Layout';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEventById(id).then(async (ev) => {
        setEvent(ev);
        if (ev) {
          const clubData = await getClubById(ev.clubId);
          setClub(clubData);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold tracking-[0.3em] uppercase italic text-xs">Accessing Data...</div>;
  if (!event) return <div className="min-h-screen bg-black flex items-center justify-center text-white">404: Event Not Found</div>;

  return (
    <div className="pt-20 min-h-screen bg-background text-foreground">
      {/* Immersive Header */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden border-b border-border">
        <img 
          src={event.banner || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover grayscale-[0.2]" 
          alt="banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end justify-start px-6 pb-12">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-primary text-white text-[9px] font-black tracking-widest uppercase rounded-full">
                  Verified Event
                </div>
                {club && (
                    <Link to={`/club/${club.id}`} className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-border">
                        <User size={10} /> {club.name}
                    </Link>
                )}
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter leading-[0.9]">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-white/90 font-black uppercase tracking-widest text-xs">
                  <Calendar size={14} className="text-primary" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-white/90 font-black uppercase tracking-widest text-xs">
                  <MapPin size={14} className="text-primary" />
                  {event.venue}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-8">
            <div className="mb-16">
              <SectionHeader title="Event Details" subtitle="Why you should join us." className="mb-8" />
              <div className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed whitespace-pre-wrap selection:bg-primary/30">
                {event.description}
              </div>
            </div>

            {/* Hosting Club Card */}
            <div>
              <SectionHeader title="Hosted By" subtitle="Organized by" className="mb-8" />
              <Link to={`/club/${club?.id}`}>
                <div className="p-6 border border-border rounded-2xl bg-secondary group hover:border-primary transition-all active-scale flex items-center gap-6">
                  <div className="relative">
                    <img src={club?.logo} className="w-20 h-20 rounded-xl border border-border object-cover bg-black" alt="club logo" />
                    <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full border-2 border-black">
                      <BadgeCheck size={14} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{club?.name}</h3>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1 line-clamp-1">{club?.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 border border-border rounded-3xl bg-secondary relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
                
                <h3 className="text-lg font-black text-white uppercase italic tracking-widest mb-2">RSVP Now</h3>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Registration is open.</p>
                
                <a 
                  href={event.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <FrostedButton className="w-full py-5 text-sm tracking-[0.2em]">
                    REGISTER NOW
                  </FrostedButton>
                </a>
                
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-6 text-center leading-relaxed">
                  Notice: External portal redirect enforced.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-4 bg-secondary border border-border text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-900 transition-all active-scale"
                >
                  <Share2 size={14} /> Share
                </button>
                <Link 
                  to={`/club/${club?.id}`}
                  className="flex items-center justify-center gap-2 py-4 bg-secondary border border-border text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-900 transition-all active-scale"
                >
                  <User size={14} /> Club Info
                </Link>
              </div>
              
              <div className="p-6 border border-dashed border-border rounded-2xl">
                 <p className="text-[10px] text-muted-foreground font-medium italic text-center">
                    "Great things happen when diverse minds collide in a shared space."
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
