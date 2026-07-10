export interface Award {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  year: number;
  month: number;
  role: string[];
  tools: string[];
  rating: number;
  awards?: Award[];
}
