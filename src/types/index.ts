export interface Club {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  email: string;
}

export interface Event {
  id: string;
  clubId: string;
  title: string;
  description: string;
  banner: string;
  venue: string;
  date: string;
  registrationLink: string;
  createdAt: any;
}
