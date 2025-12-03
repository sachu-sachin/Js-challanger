import { Link } from "react-router-dom";

export function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-yellow-500/30">
            <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
                <Link to="/" className="text-xl font-bold text-yellow-500 flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl">⚡</span> <span className="hidden sm:inline">JS Challenger</span>
                </Link>
                <nav className="flex gap-6">
                    <Link to="/topic/variables" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Topics</Link>
                    <a href="https://github.com/sachu-sachin/Js-challanger.git" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">GitHub</a>
                </nav>
            </header>
            <main className="flex-1 flex flex-col relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 blur-[120px] rounded-full" />
                </div>
                {children}
            </main>
        </div>
    );
}
