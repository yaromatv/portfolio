import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-background fixed inset-x-0 top-0 z-40 flex h-8 items-center justify-center gap-8 backdrop-blur-xs">
      <Link
        href="/portfolio"
        className="text-sm tracking-wide transition-colors hover:text-gray-400"
      >
        PORTFOLIO
      </Link>
      <Link href="/about" className="text-sm tracking-wide transition-colors hover:text-gray-400">
        ABOUT
      </Link>
    </nav>
  );
}
