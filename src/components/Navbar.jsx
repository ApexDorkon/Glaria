export default function Navbar() {
  return (
    <div className="w-full flex justify-between items-center px-8 py-4 bg-white/30 backdrop-blur-lg rounded-3xl border border-white/40 shadow-md">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Glaria Logo" className="w-8 h-8" />
        <span className="text-xl font-semibold tracking-wide">GLARIA</span>
      </div>
      <nav className="space-x-8 font-medium text-gray-800">
        <a href="#projects" className="hover:text-black">Projects</a>
        <a href="#quests" className="hover:text-black">Quests</a>
        <a href="#connect" className="hover:text-black">Connect</a>
      </nav>
    </div>
  );
}
