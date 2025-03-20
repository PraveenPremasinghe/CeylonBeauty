export interface Testimonial {
  id: string;
  name: string;
  tourDate: string;
  rating: number;
  feedback: string; // Replace "content" with "feedback"
  images: string[]; // Add "images"
  createdAt: string; // Add "createdAt"
  designation?: string; // Optional field
  image?: string; // Optional field
}
