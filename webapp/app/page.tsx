import { redirect } from 'next/navigation';

export default function HomePage() {
  // This will automatically redirect the user to the dashboard page
  redirect('/dashboard');

  // Since redirect() is called, this part will not be rendered.
  // You can return null or an empty fragment.
  return null;
}