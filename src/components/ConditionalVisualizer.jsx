import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Play, Pause, GitBranch } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ScopeMemoryPanel from './ScopeMemoryPanel';
import CallStackPanel from './CallStackPanel';

const ConditionalVisualizer = () => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const scenarios = [
        {
            title: "If Statement",
            description: "Executes code block if the condition is true.",
            code: `let age = 18;
if (age >= 18) {
  console.log("Adult");
}`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { age: { value: "18", status: "new" } } }],
                    note: "Initialize age = 18"
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { age: { value: "18", status: "stable" } } }],
                    note: "Check: 18 >= 18 is true"
                },
                {
                    line: 3,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: { age: { value: "18", status: "stable" } } },
                        { type: "Block", name: "If Block", variables: {} }
                    ],
                    output: ["Adult"],
                    note: "Enter block. Print 'Adult'"
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { age: { value: "18", status: "stable" } } }],
                    output: ["Adult"],
                    note: "Exit block."
                }
            ]
        },
        {
            title: "If-Else Statement",
            description: "Executes one block if true, another if false.",
            code: `let time = 10;
if (time > 12) {
  console.log("PM");
} else {
  console.log("AM");
}`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { time: { value: "10", status: "new" } } }],
                    note: "Initialize time = 10"
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { time: { value: "10", status: "stable" } } }],
                    note: "Check: 10 > 12 is false"
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { time: { value: "10", status: "stable" } } }],
                    note: "Skip if block. Go to else."
                },
                {
                    line: 5,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: { time: { value: "10", status: "stable" } } },
                        { type: "Block", name: "Else Block", variables: {} }
                    ],
                    output: ["AM"],
                    note: "Enter else block. Print 'AM'"
                },
                {
                    line: 6,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { time: { value: "10", status: "stable" } } }],
                    output: ["AM"],
                    note: "Exit block."
                }
            ]
        },
        {
            title: "Ternary Operator",
            description: "Concise if-else shorthand.",
            code: `let age = 20;
let status = (age >= 18) ? "Adult" : "Minor";
console.log(status);`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { age: { value: "20", status: "new" }, status: { value: "<TDZ>", status: "new" } } }],
                    note: "Initialize age = 20"
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { age: { value: "20", status: "stable" }, status: { value: "<TDZ>", status: "stable" } } }],
                    note: "Check condition: 20 >= 18 (true)"
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { age: { value: "20", status: "stable" }, status: { value: "\"Adult\"", status: "changed" } } }],
                    note: "Assign 'Adult' to status"
                },
                {
                    line: 3,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { age: { value: "20", status: "stable" }, status: { value: "\"Adult\"", status: "stable" } } }],
                    output: ["Adult"],
                    note: "Print status"
                }
            ]
        }
    ];

    const currentScenario = scenarios[scenarioIndex];
    const currentStep = currentScenario.steps[stepIndex];

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setStepIndex(prev => {
                    if (prev < currentScenario.steps.length - 1) return prev + 1;
                    setIsPlaying(false);
                    return prev;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentScenario.steps.length]);

    const handleNext = () => {
        if (stepIndex < currentScenario.steps.length - 1) {
            setStepIndex(stepIndex + 1);
        }
    };

    const handlePrev = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };

    const handleReset = () => {
        setStepIndex(0);
        setIsPlaying(false);
    };

    const handleScenarioChange = (direction) => {
        const newIndex = direction === 'next'
            ? Math.min(scenarioIndex + 1, scenarios.length - 1)
            : Math.max(scenarioIndex - 1, 0);
        setScenarioIndex(newIndex);
        setStepIndex(0);
        setIsPlaying(false);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-gray-100 font-sans overflow-hidden">
            {/* Header */}
            <header className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center shadow-md z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <GitBranch className="text-blue-400 w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Conditional <span className="text-blue-400">Visualizer</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={() => handleScenarioChange('prev')}
                            disabled={scenarioIndex === 0}
                            className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-medium text-slate-300 min-w-[200px] text-center">
                            {currentScenario.title}
                        </span>
                        <button
                            onClick={() => handleScenarioChange('next')}
                            disabled={scenarioIndex === scenarios.length - 1}
                            className="p-2 hover:bg-slate-700 rounded-md disabled:opacity-30 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Panel: Code & Controls */}
                <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/50">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Source Code</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto relative">
                        <SyntaxHighlighter
                            language="javascript"
                            style={atomDark}
                            showLineNumbers={true}
                            wrapLines={true}
                            lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#475569', textAlign: 'right' }}
                            customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem', lineHeight: '1.5' }}
                            lineProps={(lineNumber) => {
                                const style = { display: 'block', width: '100%' };
                                if (currentStep.line === lineNumber) {
                                    style.backgroundColor = 'rgba(59, 130, 246, 0.2)'; // blue-500/20
                                    style.borderLeft = '2px solid #3b82f6'; // blue-500
                                }
                                return { style };
                            }}
                        >
                            {currentScenario.code}
                        </SyntaxHighlighter>
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="text-sm text-slate-400 mb-1">Current Step:</div>
                        <div className="text-blue-100 font-medium">{currentStep.note}</div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-center gap-4">
                        <button onClick={handleReset} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Reset">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button onClick={handlePrev} disabled={stepIndex === 0} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full bg-blue-500 hover:bg-blue-400 text-slate-900 transition-colors shadow-lg shadow-blue-500/20">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>
                        <button onClick={handleNext} disabled={stepIndex === currentScenario.steps.length - 1} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-colors">
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Center Panel: Call Stack */}
                <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-950">
                    <CallStackPanel stack={currentStep.stack || []} />
                </div>

                {/* Right Panel: Scope Chain & Memory */}
                <div className="w-1/3 flex flex-col bg-slate-900/30">
                    <div className="flex-1 flex flex-col min-h-0">
                        <ScopeMemoryPanel scopes={currentStep.scopes || []} />

                        {/* Console Output (Integrated into Right Panel for Conditionals) */}
                        <div className="h-1/3 border-t border-slate-800 bg-black/50 p-4 font-mono text-sm overflow-y-auto">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Console Output</h3>
                            {currentStep.output && currentStep.output.length > 0 ? (
                                currentStep.output.map((line, i) => (
                                    <div key={i} className="text-slate-300 mb-1">
                                        <span className="text-slate-600 mr-2">{'>'}</span>
                                        {line}
                                    </div>
                                ))
                            ) : (
                                <span className="text-slate-600 italic">// Output will appear here...</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConditionalVisualizer;
