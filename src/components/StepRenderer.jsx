import { useState, useEffect } from "react";
import { CodeEditor } from "./CodeEditor";
import { TestRunner } from "./TestRunner";
import { ChevronRight, CheckCircle2 } from "lucide-react";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css"; // Import a dark theme

export function StepRenderer({ step, onComplete, isLastStep, isCompleted, isActive }) {
    const [code, setCode] = useState("");

    // Reset code when step changes or initializes
    useEffect(() => {
        if (step.type === "editor") {
            setCode(step.startingCode);
        }
    }, [step]);

    const containerClass = `relative rounded-2xl border transition-all duration-500 overflow-hidden ${isActive
        ? "bg-gray-900 border-yellow-500/30 shadow-2xl shadow-yellow-500/5"
        : "bg-gray-900/50 border-gray-800 opacity-60 grayscale-[0.5]"
        }`;

    if (step.type === "theory") {
        return (
            <div className={containerClass}>
                <div className="p-8">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{step.content}</ReactMarkdown>
                    </div>

                    {isActive && (
                        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-2">
                            <button
                                onClick={onComplete}
                                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-950 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-900/20"
                            >
                                {isLastStep ? "Start Quiz" : "Continue"}
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="absolute top-4 right-4 text-green-500 animate-in zoom-in spin-in-90 duration-300">
                            <CheckCircle2 size={24} />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (step.type === "snippet") {
        return (
            <div className={containerClass}>
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-800">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="ml-2 text-xs text-gray-500 font-mono">example.js</span>
                    {isCompleted && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
                </div>

                <div className="p-0">
                    <pre className="p-6 text-sm font-mono text-gray-300 overflow-x-auto bg-gray-950/30">
                        <code>{step.code}</code>
                    </pre>
                </div>

                {isActive && (
                    <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end">
                        <button
                            onClick={onComplete}
                            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-950 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-900/20"
                        >
                            {isLastStep ? "Start Quiz" : "Got it!"}
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (step.type === "editor") {
        // We need local state to track if the challenge is passed to show the "Next" button
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isPassed, setIsPassed] = useState(false);

        const handleSuccess = () => {
            setIsPassed(true);
        };

        return (
            <div className={containerClass}>
                <div className="flex flex-col divide-y divide-gray-800">
                    {/* 1. Instructions (Top) */}
                    <div className="p-6 lg:p-8 flex flex-col gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-yellow-500/20 text-yellow-500 text-xs">
                                    {`</>`}
                                </span>
                                Challenge
                            </h3>
                            <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{step.instructions}</ReactMarkdown>
                            </div>
                        </div>


                    </div>

                    {/* 2. Editor (Middle) */}
                    <div className="h-[400px] bg-gray-950/30 relative group border-b border-gray-800">
                        <CodeEditor
                            code={code}
                            onChange={isActive ? setCode : undefined}
                        />
                        {!isActive && <div className="absolute inset-0 bg-gray-950/10 z-10" />}
                    </div>

                    {/* 3. Test Runner / Console (Bottom) */}
                    {isActive && (
                        <div className="bg-gray-900/50 p-4">
                            {step.validate ? (
                                <TestRunner
                                    code={code}
                                    tests={step.validate.tests}
                                    patterns={step.validate.patterns}
                                    parameters={step.validate.parameters}
                                    functionName={step.validate.functionName}
                                    validate={step.validate}
                                    onSuccess={handleSuccess}
                                />
                            ) : (
                                <div className="flex justify-end">
                                    <button
                                        onClick={onComplete}
                                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                    >
                                        Run & Continue
                                    </button>
                                </div>
                            )}

                            {/* Manual Next Button - Only appears when passed */}
                            {isPassed && (
                                <div className="mt-4 flex justify-end animate-in fade-in slide-in-from-bottom-2">
                                    <button
                                        onClick={onComplete}
                                        className="group flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-900/20"
                                    >
                                        {isLastStep ? "Start Quiz" : "Next Step"}
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isCompleted && (
                        <div className="p-4 bg-green-900/10 flex items-center justify-between text-green-400">
                            <span className="font-medium flex items-center gap-2">
                                <CheckCircle2 size={20} />
                                Challenge Completed
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
