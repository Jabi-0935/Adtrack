export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 py-8 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} ADTrack Medical Analysis. All rights reserved.</p>
    </footer>
  );
}