import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { StepRenderer } from "../components/StepRenderer";
import { QuizRunner } from "../components/QuizRunner";
import { StepNavigator } from "../components/StepNavigator";
import { ArrowLeft, Menu, X, Circle, PlayCircle } from "lucide-react";
import topics from "../data/topics.json";

export function TaskPage() {
    const { topicId, taskId } = useParams();
    const navigate = useNavigate();
    const topic = topics.find((t) => t.id === topicId);
    const bottomRef = useRef(null);

    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [completedStepIndex, setCompletedStepIndex] = useState(-1); // -1 means no steps completed, 0 means first step completed (so show 0 and 1)
    const [showQuiz, setShowQuiz] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

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

    useEffect(() => {
        if (tasks.length > 0 && taskId) {
            const task = tasks.find((t) => t.id === taskId);
            if (task) {
                setCurrentTask(task);
                setCompletedStepIndex(-1); // Reset to start
                setShowQuiz(false);
            }
        }
    }, [tasks, taskId]);

    // Auto-scroll to bottom when a new step is added
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [completedStepIndex, showQuiz]);

    const handleStepComplete = () => {
        const nextIndex = completedStepIndex + 1;
        setCompletedStepIndex(nextIndex);

        if (nextIndex === currentTask.steps.length - 1) {
            setShowQuiz(true);
        }

        // Auto scroll to next step is handled by the rendering logic, 
        // but we might want to ensure the view is updated.
    };

    const handleStepClick = (index) => {
        // Allow navigation to any unlocked step
        // We need to scroll to that step
        const element = document.getElementById(`step-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setIsSidebarOpen(false);
    };

    const handleLessonComplete = () => {
        const currentIndex = tasks.findIndex(t => t.id === taskId);
        if (currentIndex < tasks.length - 1) {
            const nextTask = tasks[currentIndex + 1];
            navigate(`/topic/${topicId}/task/${nextTask.id}`);
        } else {
            navigate(`/topic/${topicId}`);
        }
    };

    if (loading || !topic || !currentTask) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Calculate progress based on completed steps
    // If completedStepIndex is -1, progress is 0.
    // If completedStepIndex is 0 (first step done), progress is 1 / total.
    const totalSteps = currentTask.steps.length + (currentTask.quiz ? 1 : 0);
    const currentProgressStep = showQuiz ? totalSteps : completedStepIndex + 1;
    const progress = (currentProgressStep / totalSteps) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-yellow-500/30">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
                <div className="flex items-center gap-4">
                    <Link to={`/topic/${topicId}`} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{topic.title}</span>
                        <span className="text-sm font-bold text-gray-100">{currentTask.title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link to="/" className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden ">
                {/* Sidebar (Desktop) */}
                <aside className="hidden md:block fixed w-72 bg-gray-900/50 border-r border-gray-800 overflow-y-auto p-4 flex-shrink-0 ">
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lesson Steps</h3>
                        <StepNavigator
                            steps={currentTask.steps}
                            currentStepIndex={completedStepIndex + 1} // Approximation of "current"
                            completedStepIndex={completedStepIndex}
                            onStepClick={handleStepClick}
                        />
                    </div>
                    {currentTask.quiz && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assessment</h3>
                            <div className={`p-3 rounded-md border ${showQuiz ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-gray-900/50 border-gray-800 text-gray-500'}`}>
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <span className="flex-shrink-0">
                                        {showQuiz ? <PlayCircle size={18} /> : <Circle size={18} />}
                                    </span>
                                    Final Quiz
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Mobile Sidebar Drawer */}
                {isSidebarOpen && (
                    <div className="absolute inset-0 z-40 md:hidden bg-gray-950/95 backdrop-blur-sm p-4 animate-in slide-in-from-right">
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lesson Steps</h3>
                            <StepNavigator
                                steps={currentTask.steps}
                                currentStepIndex={completedStepIndex + 1}
                                completedStepIndex={completedStepIndex}
                                onStepClick={handleStepClick}
                            />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto relative scroll-smooth p-4 sm:p-8 lg:p-12">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
                    </div>

                    <div className="max-w-3xl mx-auto space-y-12 pb-32">
                        {currentTask.steps.map((step, index) => {
                            // Show steps up to the current one (completedStepIndex + 1)
                            if (index > completedStepIndex + 1) return null;

                            const isCurrent = index === completedStepIndex + 1;
                            const isCompleted = index <= completedStepIndex;

                            return (
                                <div
                                    key={index}
                                    id={`step-${index}`}
                                    className={`transition-all duration-700 ${isCurrent ? 'opacity-100 translate-y-0' : 'opacity-100'}`}
                                >
                                    <StepRenderer
                                        step={step}
                                        onComplete={isCurrent ? handleStepComplete : null}
                                        isLastStep={index === currentTask.steps.length - 1}
                                        isCompleted={isCompleted}
                                        isActive={isCurrent}
                                    />
                                    {/* Connector Line */}
                                    {index < currentTask.steps.length - 1 && (index <= completedStepIndex) && (
                                        <div className="w-0.5 h-8 bg-gray-800 mx-auto my-4" />
                                    )}
                                </div>
                            );
                        })}

                        {showQuiz && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="w-0.5 h-8 bg-gray-800 mx-auto my-4" />
                                <QuizRunner
                                    quiz={currentTask.quiz}
                                    onComplete={handleLessonComplete}
                                />
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                </main>
            </div>
        </div>
    );
}
