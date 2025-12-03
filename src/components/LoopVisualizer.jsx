import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Play, Pause } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ScopeMemoryPanel from './ScopeMemoryPanel';
import CallStackPanel from './CallStackPanel';

const LoopVisualizer = () => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const scenarios = [
        {
            title: "For Loop: Basic Iteration",
            description: "A standard for loop that runs a specific number of times.",
            code: `for (let i = 0; i < 3; i++) {
  console.log("Count: " + i);
}`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: {} }],
                    note: "Initialization: Create variable 'i' and set to 0.",
                    stepType: 'execution'
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "0", status: "new" } } }
                    ],
                    note: "Condition Check: Is 0 < 3? True. Enter loop.",
                    stepType: 'condition',
                    conditionResult: true
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "0", status: "stable" } } }
                    ],
                    output: ["Count: 0"],
                    note: "Action: Evaluate 'Count: ' + 0. Result: 'Count: 0'.",
                    stepType: 'execution'
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "1", status: "changed" } } }
                    ],
                    output: ["Count: 0"],
                    note: "Increment: i becomes 1.",
                    stepType: 'increment'
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "1", status: "stable" } } }
                    ],
                    output: ["Count: 0"],
                    note: "Condition Check: Is 1 < 3? True. Continue loop.",
                    stepType: 'condition',
                    conditionResult: true
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "1", status: "stable" } } }
                    ],
                    output: ["Count: 0", "Count: 1"],
                    note: "Action: Evaluate 'Count: ' + 1. Result: 'Count: 1'.",
                    stepType: 'execution'
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "2", status: "changed" } } }
                    ],
                    output: ["Count: 0", "Count: 1"],
                    note: "Increment: i becomes 2.",
                    stepType: 'increment'
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "2", status: "stable" } } }
                    ],
                    output: ["Count: 0", "Count: 1"],
                    note: "Condition Check: Is 2 < 3? True. Continue loop.",
                    stepType: 'condition',
                    conditionResult: true
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "2", status: "stable" } } }
                    ],
                    output: ["Count: 0", "Count: 1", "Count: 2"],
                    note: "Action: Evaluate 'Count: ' + 2. Result: 'Count: 2'.",
                    stepType: 'execution'
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "3", status: "changed" } } }
                    ],
                    output: ["Count: 0", "Count: 1", "Count: 2"],
                    note: "Increment: i becomes 3.",
                    stepType: 'increment'
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Loop Block", variables: { i: { value: "3", status: "stable" } } }
                    ],
                    output: ["Count: 0", "Count: 1", "Count: 2"],
                    note: "Condition Check: Is 3 < 3? False. Exit loop.",
                    stepType: 'condition',
                    conditionResult: false
                },
                {
                    line: 3,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: {} }],
                    output: ["Count: 0", "Count: 1", "Count: 2"],
                    note: "Loop Finished. Block Scope destroyed.",
                    stepType: 'execution'
                }
            ]
        },
        {
            title: "While Loop",
            description: "Runs as long as the condition is true.",
            code: `let count = 0;
while (count < 2) {
  console.log(count);
  count++;
}`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "0", status: "new" } } }],
                    note: "Initialize count = 0",
                    stepType: 'execution'
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "0", status: "stable" } } }],
                    note: "Condition Check: Is 0 < 2? True.",
                    stepType: 'condition',
                    conditionResult: true
                },
                {
                    line: 3,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "0", status: "stable" } } }],
                    output: ["0"],
                    note: "Action: Print count (0).",
                    stepType: 'execution'
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "1", status: "changed" } } }],
                    output: ["0"],
                    note: "Increment count to 1.",
                    stepType: 'increment'
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "1", status: "stable" } } }],
                    output: ["0"],
                    note: "Condition Check: Is 1 < 2? True.",
                    stepType: 'condition',
                    conditionResult: true
                },
                {
                    line: 3,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "1", status: "stable" } } }],
                    output: ["0", "1"],
                    note: "Action: Print count (1).",
                    stepType: 'execution'
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "2", status: "changed" } } }],
                    output: ["0", "1"],
                    note: "Increment count to 2.",
                    stepType: 'increment'
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "2", status: "stable" } } }],
                    output: ["0", "1"],
                    note: "Condition Check: Is 2 < 2? False.",
                    stepType: 'condition',
                    conditionResult: false
                },
                {
                    line: 5,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { count: { value: "2", status: "stable" } } }],
                    output: ["0", "1"],
                    note: "Loop Finished.",
                    stepType: 'execution'
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
            }, 1500); // Slower for better readability of animations
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
                    <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <RefreshCw className="text-yellow-400 w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Loop <span className="text-yellow-400">Visualizer</span>
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
                    <div className="flex-1 overflow-y-auto relative bg-[#1e1e1e]"> {/* Darker background */}
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
                                    // Dynamic highlighting based on step type
                                    if (currentStep.stepType === 'condition') {
                                        if (currentStep.conditionResult === true) {
                                            style.backgroundColor = 'rgba(34, 197, 94, 0.2)'; // green-500/20
                                            style.borderLeft = '4px solid #22c55e'; // green-500
                                            style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.1)';
                                        } else {
                                            style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; // red-500/20
                                            style.borderLeft = '4px solid #ef4444'; // red-500
                                            style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.1)';
                                        }
                                    } else {
                                        style.backgroundColor = 'rgba(234, 179, 8, 0.2)'; // yellow-500/20
                                        style.borderLeft = '4px solid #eab308'; // yellow-500
                                    }
                                }
                                return { style };
                            }}
                        >
                            {currentScenario.code}
                        </SyntaxHighlighter>
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="text-sm text-slate-400 mb-1">Current Step:</div>
                        <div className="text-yellow-100 font-medium text-lg">{currentStep.note}</div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-center gap-4">
                        <button onClick={handleReset} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Reset">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button onClick={handlePrev} disabled={stepIndex === 0} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 transition-colors shadow-lg shadow-yellow-500/20">
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

                        {/* Console Output */}
                        <div className="h-1/3 border-t border-slate-800 bg-black/50 p-4 font-mono text-sm overflow-y-auto">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Console Output</h3>
                            {currentStep.output && currentStep.output.length > 0 ? (
                                currentStep.output.map((line, i) => (
                                    <div key={i} className={`text-slate-300 mb-1 ${i === currentStep.output.length - 1 ? 'animate-pulse text-white' : ''}`}>
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

export default LoopVisualizer;
