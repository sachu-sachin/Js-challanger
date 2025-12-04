import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ArrowLeft, PlayCircle, CheckCircle2, Lock, Clock } from "lucide-react";
import * as Icons from "lucide-react";
import topics from "../data/topics.json";
import { useState, useEffect } from "react";
import { getTopicProgress } from "../utils/progressStorage";

export function TopicPage() {
    const { topicId } = useParams();
    const topic = topics.find((t) => t.id === topicId);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskProgress, setTaskProgress] = useState({});

    useEffect(() => {
        async function loadTasks() {
            try {
                const module = await import(`../data/tasks/${topicId}.json`);
                setTasks(module.default);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load tasks", error);
                setTasks([]);
                setLoading(false);
            }
        }
        if (topicId) {
            loadTasks();
        }
    }, [topicId]);

    // Load progress for all tasks in the topic
    useEffect(() => {
        if (topicId && tasks.length > 0) {
            const progress = getTopicProgress(topicId);
            setTaskProgress(progress);
        }
    }, [topicId, tasks]);

    if (!topic) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Topic not found</h2>
                    <Link to="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} />
                        Go back home
                    </Link>
                </div>
            </Layout>
        );
    }

    const Icon = Icons[topic.icon] || Icons.Box;

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Topics
                    </Link>
                    <div className="flex items-start gap-6">
                        <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-2xl text-indigo-400 shadow-lg shadow-indigo-900/20">
                            <Icon size={40} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{topic.title}</h1>
                            <p className="text-xl text-gray-400 leading-relaxed">{topic.description}</p>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Curriculum</h2>
                        <span className="text-sm text-gray-500">{tasks.length} Lessons</span>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-gray-900/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : tasks.length > 0 ? (
                        tasks.map((task, index) => {
                            const progress = taskProgress[task.id];
                            const isCompleted = progress?.completed || false;
                            const completedStepsCount = progress?.completedSteps?.length || 0;
                            const totalSteps = task.steps.length;
                            const hasProgress = completedStepsCount > 0;
                            const showProgress = hasProgress && !isCompleted;

                            return (
                                <Link
                                    key={task.id}
                                    to={`/topic/${topicId}/task/${task.id}`}
                                    className={`group block rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                                        isCompleted
                                            ? 'bg-green-900/10 border border-green-500/30 hover:border-green-500/50 hover:bg-green-900/20'
                                            : hasProgress
                                            ? 'bg-indigo-900/10 border border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-900/20'
                                            : 'bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono text-lg font-medium border transition-colors ${
                                            isCompleted
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30 group-hover:bg-green-500/30'
                                                : hasProgress
                                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-500/30'
                                                : 'bg-gray-800 text-gray-500 border-gray-700 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30'
                                        }`}>
                                            {isCompleted ? (
                                                <CheckCircle2 size={24} />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`text-lg font-semibold transition-colors ${
                                                    isCompleted
                                                        ? 'text-green-200 group-hover:text-green-100'
                                                        : hasProgress
                                                        ? 'text-indigo-200 group-hover:text-indigo-100'
                                                        : 'text-gray-200 group-hover:text-white'
                                                }`}>
                                                    {task.title}
                                                </h3>
                                                {isCompleted && (
                                                    <CheckCircle2 size={16} className="text-green-400" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className={`text-sm transition-colors line-clamp-1 ${
                                                    isCompleted
                                                        ? 'text-green-400/70 group-hover:text-green-400'
                                                        : hasProgress
                                                        ? 'text-indigo-400/70 group-hover:text-indigo-400'
                                                        : 'text-gray-500 group-hover:text-gray-400'
                                                }`}>
                                                    {task.description || task.theory}
                                                </p>
                                                {showProgress && (
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                                        {completedStepsCount}/{totalSteps} steps
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform group-hover:scale-110 ${
                                                isCompleted
                                                    ? 'bg-green-600 text-white'
                                                    : hasProgress
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-800 text-gray-500 group-hover:bg-indigo-600 group-hover:text-white'
                                            }`}>
                                                {isCompleted ? (
                                                    <CheckCircle2 size={20} />
                                                ) : (
                                                    <PlayCircle size={20} className="ml-1" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                            <Clock size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-400">Coming Soon</h3>
                            <p className="text-gray-500">New lessons are being added to this topic.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
