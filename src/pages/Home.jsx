import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import topics from "../data/topics.json";
import { ArrowRight, Code, Sparkles, Trophy, Zap, GitBranch, Layers, Play, Star, Users, CheckCircle } from "lucide-react";

export function Home() {
    return (
        <Layout>
            <div className="min-h-screen bg-slate-950">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
                                    <Sparkles size={16} className="text-brand-gold" />
                                    <span className="text-brand-gold-light">Master JavaScript interactively</span>
                                </div>
                                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-6 duration-700">
                                    Level Up Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 animate-shine bg-[length:200%_auto]">
                                        JavaScript Skills
                                    </span>
                                </h1>
                                <p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                    Stop watching tutorials. Start writing code. Interactive lessons, visualizers, and bite-sized challenges to help you master JavaScript.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                                    <Link to="/topic/variables" className="w-full sm:w-auto px-8 py-4 bg-brand-gold hover:bg-yellow-500 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                                        Start Learning <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/visualizer" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 group">
                                        <Play size={20} className="group-hover:text-brand-gold transition-colors" />
                                        Try Visualizers
                                    </Link>
                                </div>
                                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-brand-gold" />
                                        <span>Interactive</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-brand-gold" />
                                        <span>Visual</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-brand-gold" />
                                        <span>Free</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Visual/Graphic */}
                            <div className="relative lg:h-[600px] hidden lg:flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 to-purple-500/10 rounded-full blur-3xl" />
                                <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs text-slate-500 font-mono">script.js</span>
                                    </div>
                                    <div className="space-y-3 font-mono text-sm">
                                        <div className="flex">
                                            <span className="text-purple-400 w-8">1</span>
                                            <span className="text-purple-400">const</span> <span className="text-blue-400 ml-2">learn</span> = <span className="text-yellow-300">()</span> <span className="text-purple-400">=&gt;</span> <span className="text-yellow-300">{`{`}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-slate-600 w-8">2</span>
                                            <span className="ml-4 text-purple-400">while</span><span className="text-yellow-300">(</span><span className="text-blue-400">alive</span><span className="text-yellow-300">)</span> <span className="text-yellow-300">{`{`}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-slate-600 w-8">3</span>
                                            <span className="ml-8 text-blue-400">eat</span><span className="text-yellow-300">();</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-slate-600 w-8">4</span>
                                            <span className="ml-8 text-blue-400">sleep</span><span className="text-yellow-300">();</span>
                                        </div>
                                        <div className="flex bg-brand-gold/10 -mx-6 px-6 py-1 border-l-2 border-brand-gold">
                                            <span className="text-slate-600 w-8">5</span>
                                            <span className="ml-8 text-blue-400">code</span><span className="text-yellow-300">();</span>
                                            <span className="ml-4 text-brand-gold text-xs flex items-center gap-1"><Sparkles size={12} /> Active Line</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-slate-600 w-8">6</span>
                                            <span className="ml-4 text-yellow-300">{`}`}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-slate-600 w-8">7</span>
                                            <span className="text-yellow-300">{`}`}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating Badges */}
                                <div className="absolute top-20 -right-4 bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-xl animate-bounce duration-[3000ms]">
                                    <Zap className="text-yellow-400" size={24} />
                                </div>
                                <div className="absolute bottom-32 -left-8 bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-xl animate-bounce duration-[4000ms] delay-700">
                                    <Code className="text-blue-400" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features / Visualizers Bento Grid */}
                <section className="py-20 bg-slate-900/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Visualize Your Code</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Don't just read code. See how it works under the hood with our interactive visualizers.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {/* Main Feature - Memory */}
                            <Link to="/visualizer" className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700 p-8 hover:border-brand-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/10">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Zap className="w-64 h-64 text-brand-gold" />
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold mb-6">
                                            <Zap size={24} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Memory Visualizer</h3>
                                        <p className="text-slate-400 max-w-md">
                                            See exactly how JavaScript manages memory. Watch the Stack and Heap in action as variables are created and functions are called.
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <span className="inline-flex items-center text-brand-gold font-medium group-hover:translate-x-2 transition-transform">
                                            Explore Memory <ArrowRight className="ml-2 w-5 h-5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* Secondary Feature - Loop */}
                            <Link to="/visualizer/loop" className="group relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700 p-8 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy className="w-32 h-32 text-yellow-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500 mb-4">
                                        <Trophy size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Loop Visualizer</h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Step through loops and understand control flow.
                                    </p>
                                    <span className="inline-flex items-center text-yellow-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                        Try Loops <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </div>
                            </Link>

                            {/* Tertiary Feature - Conditional */}
                            <Link to="/visualizer/conditional" className="group relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700 p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <GitBranch className="w-32 h-32 text-blue-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                                        <GitBranch size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Conditionals</h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Visualize If, Else, and Switch logic flows.
                                    </p>
                                    <span className="inline-flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                        Explore <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </div>
                            </Link>

                            {/* Quaternary Feature - Scope */}
                            <Link to="/visualizer/scope" className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700 p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Layers className="w-48 h-48 text-purple-500" />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                                            <Layers size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Scope & Hoisting</h3>
                                        <p className="text-slate-400 text-sm max-w-sm">
                                            Master the tricky parts: Closures, TDZ, and Block Scope.
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
                                        Learn Scope <ArrowRight className="ml-2 w-5 h-5" />
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Learning Path / Topics */}
                <section className="py-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Learning Path</h2>
                                <p className="text-slate-400">Structured lessons to take you from beginner to pro.</p>
                            </div>
                            <Link to="/topic/variables" className="text-brand-gold hover:text-brand-gold-light font-medium flex items-center gap-2">
                                View all topics <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((topic, index) => (
                                <Link
                                    key={topic.id}
                                    to={`/topic/${topic.id}`}
                                    className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-brand-gold/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
                                                <Code size={24} />
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-400 border border-slate-700">
                                                {index + 1}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
                                            {topic.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                            {topic.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Code size={14} />
                                                <span>5 Lessons</span>
                                            </div>
                                            <span className="flex items-center gap-1 text-sm font-medium text-brand-gold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                                Start
                                                <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust/Stats Section */}
                <section className="py-20 border-t border-slate-800/50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                                <div className="w-12 h-12 mx-auto rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 mb-4">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">10k+</h3>
                                <p className="text-slate-400 text-sm">Students Learning</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                                <div className="w-12 h-12 mx-auto rounded-full bg-yellow-900/20 flex items-center justify-center text-yellow-400 mb-4">
                                    <Star size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">50+</h3>
                                <p className="text-slate-400 text-sm">Interactive Challenges</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                                <div className="w-12 h-12 mx-auto rounded-full bg-green-900/20 flex items-center justify-center text-green-400 mb-4">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">100%</h3>
                                <p className="text-slate-400 text-sm">Free Forever</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
