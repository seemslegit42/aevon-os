
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Loom Studio',
  description: 'Loom Studio: The embedded, always-available creative workspace inside nexOS.',
};

export default function LoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout was invalid, containing duplicate <html> and <body> tags which caused a build error.
  // A nested layout should just wrap its children, inheriting the main layout's structure.
  return <>{children}</>;
}
