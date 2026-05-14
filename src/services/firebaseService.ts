import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { Club, Event } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const message = error instanceof Error ? error.message : String(error);
  
  // Handle missing index error gracefully
  if (message.includes('index')) {
    console.warn('⚡ VIREON: Missing Firestore Index. Click the link in the console to fix: ', message);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CLUB SERVICES
export const getClubs = (callback: (clubs: Club[]) => void) => {
  return onSnapshot(collection(db, 'clubs'), (snapshot) => {
    const clubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Club));
    callback(clubs);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'clubs'));
};

export const getClubById = async (id: string) => {
  try {
    const clubDoc = await getDoc(doc(db, 'clubs', id));
    return clubDoc.exists() ? { id: clubDoc.id, ...clubDoc.data() } as Club : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `clubs/${id}`);
  }
};

export const getClubByEmail = async (email: string) => {
  try {
    const q = query(collection(db, 'clubs'), where('email', '==', email));
    const querySnapshot = await onSnapshot(q, (snapshot) => {
      // This is a simple fetch for the first match
    });
    // For async/await style
    // (Actual implementation below uses onSnapshot for real-time where needed)
  } catch (error) {}
};

// EVENT SERVICES
export const getEvents = (callback: (events: Event[]) => void) => {
  const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    callback(events);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'events'));
};

export const getEventsByClubId = (clubId: string, callback: (events: Event[]) => void) => {
  const q = query(collection(db, 'events'), where('clubId', '==', clubId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    callback(events);
  }, (error) => handleFirestoreError(error, OperationType.LIST, `events?clubId=${clubId}`));
};

export const getEventById = async (id: string) => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', id));
    return eventDoc.exists() ? { id: eventDoc.id, ...eventDoc.data() } as Event : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `events/${id}`);
  }
};

// WRITE SERVICES
export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'events');
  }
};

export const updateClub = async (clubId: string, clubData: Partial<Club>) => {
  try {
    const { id, ...data } = clubData as any;
    await updateDoc(doc(db, 'clubs', clubId), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `clubs/${clubId}`);
  }
};

export const createClub = async (clubData: Omit<Club, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'clubs'), clubData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'clubs');
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `events/${eventId}`);
  }
};

// STORAGE
export const uploadImage = async (file: File, path: string) => {
  const uploadTask = async () => {
    try {
      if (file.size > 1024 * 1024) {
        throw new Error('Image must be smaller than 1 MB.');
      }
      console.log(`Starting upload for ${path}...`);
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: file.type,
      };
      await uploadBytes(storageRef, file, metadata);
      const url = await getDownloadURL(storageRef);
      console.log(`Upload successful: ${url}`);
      return url;
    } catch (error: any) {
      console.error("Storage Upload Error Details:", error);
      if (error.code === 'storage/unauthorized') {
        throw new Error("Permission denied for storage. Please check your Storage Rules in Firebase Console.");
      }
      if (error.code === 'storage/retry-limit-exceeded' || error.message.includes('network') || error.message.includes('Failed to fetch')) {
        throw new Error("Upload failed. This is likely a CORS issue. Please follow the instructions to configure CORS for your bucket.");
      }
      throw error;
    }
  };

  // Add a 30s timeout to prevent "infinite" loading
  return Promise.race([
    uploadTask(),
    new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error("Upload timed out. Check your internet connection or bucket CORS settings.")), 30000)
    )
  ]);
};
