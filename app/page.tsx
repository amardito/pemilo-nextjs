import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to voter landing page by default
  redirect('/voter');
}
