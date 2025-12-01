import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import topics from "../data/topics.json";
import { ArrowRight, Code, Sparkles, Trophy, Zap } from "lucide-react";

export function Home() {
    return (
        <Layout>
            <div className="space-y-16 py-8">
                {/* Hero Section */}
                <section className="text-center space-y-6 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
                        <Sparkles size={16} />
                        <span>Master JavaScript interactively</span>
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Level Up Your <br />
                        <span className="text-indigo-400">JavaScript Skills</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Learn by doing. Interactive lessons, instant feedback, and bite-sized challenges to help you master JavaScript.
                    </p>
                </section>

                {/* Topics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {topics.map((topic, index) => (
                        <Link
                            key={topic.id}
                            to={`/topic/${topic.id}`}
                            className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:bg-gray-900 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                    {/* Icon placeholder logic could be improved with a map or dynamic import if needed */}
                                    <Code size={24} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{topic.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 flex-1">{topic.description}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-400">5 Lessons</span>
                                    <span className="flex items-center gap-1 text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                        Start
                                        <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-12 border-t border-gray-800/50">
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Interactive Editor</h3>
                        <p className="text-gray-400 text-sm">Write code and get instant feedback right in your browser.</p>
                    </div>
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400">
                            <Trophy size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Gamified Learning</h3>
                        <p className="text-gray-400 text-sm">Earn points and track your progress as you master new skills.</p>
                    </div>
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-green-900/20 flex items-center justify-center text-green-400">
                            <Code size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Real-world Examples</h3>
                        <p className="text-gray-400 text-sm">Learn with practical examples that you can use in your projects.</p>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
