import { useState } from "react";
import { Check, X, RefreshCw, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function QuizRunner({ quiz, onComplete }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = quiz[currentQuestionIndex];

    const handleOptionClick = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === currentQuestion.answerIndex) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        const percentage = (score / quiz.length) * 100;
        return (
            <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-800 text-center animate-in zoom-in-95 duration-500">
                <div className="mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-indigo-900/30 flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold text-indigo-400">{score}/{quiz.length}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
                    <p className="text-gray-400">
                        {percentage === 100 ? "Perfect score! You're a master!" :
                            percentage >= 70 ? "Great job! Keep it up!" : "Good effort! Review and try again."}
                    </p>
                </div>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleRetry}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                    >
                        <RefreshCw size={18} />
                        Retry
                    </button>
                    <button
                        onClick={onComplete}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors"
                    >
                        Finish Lesson
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Quiz Time</h2>
                <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {quiz.length}</span>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <div className="text-lg text-gray-200 prose prose-invert max-w-none">
                        <ReactMarkdown>{currentQuestion.question}</ReactMarkdown>
                    </div>
                    {currentQuestion.code && (
                        <pre className="mt-4 p-4 bg-gray-950 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto border border-gray-800">
                            <code>{currentQuestion.code}</code>
                        </pre>
                    )}
                </div>
                <div className="p-4 space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        let optionClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ";

                        if (isAnswered) {
                            if (index === currentQuestion.answerIndex) {
                                optionClass += "bg-green-900/20 border-green-500/50 text-green-200";
                            } else if (index === selectedOption) {
                                optionClass += "bg-red-900/20 border-red-500/50 text-red-200";
                            } else {
                                optionClass += "bg-gray-800/50 border-gray-700 text-gray-500 opacity-50";
                            }
                        } else {
                            optionClass += "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                disabled={isAnswered}
                                className={optionClass}
                            >
                                <span>{option}</span>
                                {isAnswered && index === currentQuestion.answerIndex && <Check size={20} className="text-green-400" />}
                                {isAnswered && index === selectedOption && index !== currentQuestion.answerIndex && <X size={20} className="text-red-400" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {isAnswered && (
                <div className="mt-6 flex justify-end animate-in fade-in slide-in-from-bottom-2">
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95"
                    >
                        {currentQuestionIndex < quiz.length - 1 ? "Next Question" : "See Results"}
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
