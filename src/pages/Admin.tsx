import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion } from 'motion/react';
import { GlassCard, SectionHeader, FrostedButton } from '../components/ui/Layout';
import { 
  Plus, Trash2, Edit3, Save, LogOut, Loader2, Link as LinkIcon, 
  Calendar, MapPin, AlertCircle, User as UserIcon, X, CheckCircle, BadgeCheck 
} from 'lucide-react';
import { 
  updateClub, 
  createClub,
  createEvent, 
  deleteEvent, 
  getEventsByClubId 
} from '../services/firebaseService';
import { Event } from '../types';

export default function Admin() {
  const { user, club, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileDesc, setProfileDesc] = useState('');
  const [profileLogoUrl, setProfileLogoUrl] = useState('');
  const [profileBannerUrl, setProfileBannerUrl] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Event Create State
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventRegLink, setEventRegLink] = useState('');
  const [eventBannerUrl, setEventBannerUrl] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  // Initial Creation State
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    if (club) {
      setProfileName(club.name);
      setProfileDesc(club.description);
      setProfileLogoUrl(club.logo);
      setProfileBannerUrl(club.banner);
      const unsub = getEventsByClubId(club.id, setEvents);
      return () => unsub();
    }
  }, [club]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!club) return;
    setIsUpdatingProfile(true);
    setErrorStatus('');
    try {
      await updateClub(club.id, {
        name: profileName,
        description: profileDesc,
        logo: profileLogoUrl,
        banner: profileBannerUrl
      });
      setEditingProfile(false);
      setProfileUpdated(true);
      setTimeout(() => setProfileUpdated(false), 3000);
    } catch (error: any) {
      console.error("Profile Update Error:", error);
      setErrorStatus(error.message || String(error));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club) return;
    setIsCreatingEvent(true);
    setErrorStatus('');
    try {
      await createEvent({
        clubId: club.id,
        title: eventTitle,
        description: eventDesc,
        venue: eventVenue,
        date: eventDate,
        registrationLink: eventRegLink,
        banner: eventBannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'
      });

      setShowEventForm(false);
      resetEventForm();
    } catch (error: any) {
      setErrorStatus(error.message);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const resetEventForm = () => {
    setEventTitle('');
    setEventDesc('');
    setEventVenue('');
    setEventDate('');
    setEventRegLink('');
    setEventBannerUrl('');
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white italic tracking-widest">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <GlassCard hover={false} className="max-w-md w-full p-8 border-border">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-xl mx-auto mb-6">
              <span className="text-lg font-black italic">V</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">Admin Login</h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Identify Yourself</p>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="club@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && <p className="text-red-500 text-[10px] font-bold uppercase p-3 bg-red-500/10 border border-red-500/20 rounded-xl leading-snug">{loginError}</p>}
              <FrostedButton 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full py-4 text-xs tracking-widest"
              >
                {isLoggingIn ? <Loader2 className="animate-spin" /> : 'SIGN IN'}
              </FrostedButton>
            </form>

            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-muted-foreground text-[10px] font-black uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-4 bg-white text-black rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-3 hover:bg-white/90 transition-all active-scale disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              SIGN IN WITH GOOGLE
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!club) {
    const handleInitialCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.email) return;
      setIsCreatingProfile(true);
      try {
        await createClub({
          name: newName,
          description: newDesc,
          email: user.email,
          logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80',
          banner: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80'
        });
      } catch (err: any) {
        setLoginError(err.message);
      } finally {
        setIsCreatingProfile(false);
      }
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <GlassCard hover={false} className="max-w-md w-full p-8">
          <SectionHeader title="Setup Profile" subtitle="Create your club presence." className="mb-8 text-center" />
          <form onSubmit={handleInitialCreate} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Name</label>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                placeholder="Club Name"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Mission</label>
              <textarea 
                value={newDesc} 
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                placeholder="What defines you?"
                rows={3}
                required
              />
            </div>
            <FrostedButton 
              type="submit" 
              disabled={isCreatingProfile}
              className="w-full py-4 text-xs tracking-widest"
            >
              {isCreatingProfile ? <Loader2 className="animate-spin" /> : 'CREATE PROFILE'}
            </FrostedButton>
            <button onClick={() => auth.signOut()} className="w-full text-muted-foreground text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors underline">Cancel</button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white italic uppercase tracking-tight">
                {club.name} <span className="text-primary italic">Portal</span>
              </h1>
              <BadgeCheck className="text-primary" />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Management Dashboard</p>
          </div>
          <button onClick={() => auth.signOut()} className="px-6 py-3 bg-secondary border border-border rounded-full text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all active-scale">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {profileUpdated && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-widest"
          >
            <CheckCircle size={14} /> Profile Updated Successfully.
          </motion.div>
        )}

        {errorStatus && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 font-bold text-xs uppercase tracking-widest">
            <AlertCircle size={14} /> Error: {errorStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Profile Section */}
          <div className="lg:col-span-5">
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h2 className="text-sm sm:text-base font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                  <UserIcon size={16} className="text-primary" /> Club Settings
                </h2>
                <button 
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="p-2 border border-border rounded-full text-primary hover:bg-secondary transition-all active-scale"
                >
                  {editingProfile ? <X size={16} /> : <Edit3 size={16} />}
                </button>
              </div>

              {!editingProfile ? (
                <div className="space-y-10">
                  <div className="relative group">
                    <div className="h-40 rounded-xl overflow-hidden border border-border bg-muted">
                      <img src={club.banner} className="w-full h-full object-cover opacity-80" alt="banner" />
                    </div>
                    <img src={club.logo} className="absolute -bottom-6 left-6 w-20 h-20 rounded-xl border border-border object-cover bg-black p-1 shadow-2xl" alt="logo" />
                  </div>
                  <div className="pt-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">About the Club</h3>
                    <p className="text-white text-sm font-medium leading-relaxed">{club.description || "No description set yet."}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Club Name</label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
                    <textarea 
                      rows={4}
                      value={profileDesc}
                      onChange={(e) => setProfileDesc(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Logo Image URL</label>
                      <input 
                        type="url"
                        value={profileLogoUrl}
                        onChange={(e) => setProfileLogoUrl(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Banner Image URL</label>
                      <input 
                        type="url"
                        value={profileBannerUrl}
                        onChange={(e) => setProfileBannerUrl(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <FrostedButton 
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    className="w-full py-4 text-xs tracking-widest"
                  >
                    {isUpdatingProfile ? <Loader2 className="animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-2"><Save size={14} /> Update Profile</div>}
                  </FrostedButton>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Events Section */}
          <div className="lg:col-span-7">
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h2 className="text-sm sm:text-base font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                  <Calendar size={16} className="text-primary" /> Manage Events
                </h2>
                <button 
                  onClick={() => setShowEventForm(!showEventForm)}
                  className="px-4 py-2 bg-primary text-white font-black rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 transition-all active-scale"
                >
                  {showEventForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Event</>}
                </button>
              </div>

              {showEventForm && (
                <motion.form 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleCreateEvent}
                  className="space-y-6 mb-12 p-6 bg-secondary border border-border rounded-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Event Name</label>
                      <input 
                        required
                        type="text" 
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                        placeholder="e.g. Annual Hackathon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Location</label>
                      <input 
                        required
                        type="text" 
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                        className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                        placeholder="Auditorium, Hall, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Event Date</label>
                      <input 
                        required
                        type="text" 
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                        placeholder="e.g. Oct 24, 2026"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Registration Link</label>
                      <input 
                        required
                        type="url" 
                        value={eventRegLink}
                        onChange={(e) => setEventRegLink(e.target.value)}
                        className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                        placeholder="https://forms.gle/..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
                      <textarea 
                        required
                        rows={3}
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary font-medium"
                        placeholder="Tell students about your event..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Banner Image URL</label>
                      <input 
                        type="url"
                        value={eventBannerUrl}
                        onChange={(e) => setEventBannerUrl(e.target.value)}
                        className="w-full bg-black border border-border rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-primary"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <FrostedButton 
                    type="submit"
                    disabled={isCreatingEvent}
                    className="w-full py-4 text-xs tracking-widest"
                  >
                    {isCreatingEvent ? <Loader2 className="animate-spin mx-auto" /> : 'CREATE EVENT'}
                  </FrostedButton>
                </motion.form>
              )}

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 bg-secondary border border-border rounded-xl flex items-center justify-between group hover:bg-zinc-900 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={event.banner} className="w-12 h-10 rounded-md object-cover border border-border" alt="ev" />
                      <div>
                        <h4 className="text-white text-sm font-bold leading-tight line-clamp-1">{event.title}</h4>
                        <div className="flex items-center gap-3 text-[9px] text-muted-foreground mt-1 uppercase tracking-widest font-black">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {event.date}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} /> {event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={event.registrationLink} target="_blank" rel="noreferrer" className="p-2 border border-border rounded-full text-primary hover:bg-black transition-all active-scale">
                        <LinkIcon size={14} />
                      </a>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 border border-red-500/20 rounded-full text-red-500 hover:bg-red-500/10 transition-all active-scale"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && !showEventForm && (
                  <div className="py-20 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] italic border border-dashed border-border rounded-xl">
                    No events scheduled yet.
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
