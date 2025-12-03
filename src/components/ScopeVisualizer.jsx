import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Play, Pause, Layers } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ScopeMemoryPanel from './ScopeMemoryPanel';
import CallStackPanel from './CallStackPanel';

const ScopeVisualizer = () => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const scenarios = [
        {
            title: "Hoisting (var)",
            description: "Var declarations are hoisted to the top of their scope and initialized with undefined.",
            code: `console.log(myVar);
var myVar = 5;
console.log(myVar);`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myVar: { value: "undefined", status: "new" } } }],
                    note: "Creation Phase: myVar is hoisted and initialized to undefined."
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myVar: { value: "undefined", status: "stable" } } }],
                    output: ["undefined"],
                    note: "Execution: Accessing myVar returns undefined."
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myVar: { value: "5", status: "changed" } } }],
                    output: ["undefined"],
                    note: "Execution: Assignment myVar = 5."
                },
                {
                    line: 3,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myVar: { value: "5", status: "stable" } } }],
                    output: ["undefined", "5"],
                    note: "Execution: Print myVar (5)."
                }
            ]
        },
        {
            title: "Temporal Dead Zone (let/const)",
            description: "Let and Const are hoisted but not initialized. Accessing them before declaration throws an error.",
            code: `try {
  console.log(myLet);
} catch (e) {
  console.log(e.name);
}
let myLet = 10;
console.log(myLet);`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myLet: { value: "<TDZ>", status: "new" } } }],
                    note: "Creation Phase: myLet is hoisted but in TDZ (uninitialized)."
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myLet: { value: "<TDZ>", status: "stable" } } }],
                    note: "Execution: Accessing myLet throws ReferenceError."
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myLet: { value: "<TDZ>", status: "stable" } } }],
                    output: ["ReferenceError"],
                    note: "Catch block handles the error."
                },
                {
                    line: 6,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myLet: { value: "10", status: "changed" } } }],
                    output: ["ReferenceError"],
                    note: "Declaration: myLet is initialized to 10. TDZ ends."
                },
                {
                    line: 7,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { myLet: { value: "10", status: "stable" } } }],
                    output: ["ReferenceError", "10"],
                    note: "Print myLet."
                }
            ]
        },
        {
            title: "Block Scope",
            description: "Variables declared with let/const are only accessible within their block.",
            code: `if (true) {
  let blockVar = "Inside";
  console.log(blockVar);
}
// console.log(blockVar); // Error`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: {} }],
                    note: "Enter if block."
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Block (if)", variables: { blockVar: { value: "\"Inside\"", status: "new" } } }
                    ],
                    note: "Block Scope created. blockVar declared."
                },
                {
                    line: 3,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [
                        { type: "Global", name: "Global", variables: {} },
                        { type: "Block", name: "Block (if)", variables: { blockVar: { value: "\"Inside\"", status: "stable" } } }
                    ],
                    output: ["Inside"],
                    note: "Access blockVar inside block."
                },
                {
                    line: 5,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: {} }],
                    output: ["Inside"],
                    note: "Exit block. Block Scope destroyed."
                }
            ]
        },
        {
            title: "Lexical Scope",
            description: "Inner functions can access variables from their outer scope.",
            code: `let outer = "Outer";
function inner() {
  let innerVar = "Inner";
  console.log(outer + " " + innerVar);
}
inner();`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { outer: { value: "<TDZ>", status: "new" }, inner: { value: "fn()", status: "new" } } }],
                    note: "Creation: outer in TDZ, inner hoisted."
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { outer: { value: "\"Outer\"", status: "changed" }, inner: { value: "fn()", status: "stable" } } }],
                    note: "Execution: outer assigned."
                },
                {
                    line: 6,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { outer: { value: "\"Outer\"", status: "stable" }, inner: { value: "fn()", status: "stable" } } }],
                    note: "Call inner()."
                },
                {
                    line: 3,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "inner()", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { outer: { value: "\"Outer\"", status: "stable" }, inner: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "inner", variables: { innerVar: { value: "<TDZ>", status: "new" } } }
                    ],
                    note: "FEC (inner) Creation."
                },
                {
                    line: 3,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "inner()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { outer: { value: "\"Outer\"", status: "stable" }, inner: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "inner", variables: { innerVar: { value: "\"Inner\"", status: "changed" } } }
                    ],
                    note: "FEC (inner) Execution. innerVar assigned."
                },
                {
                    line: 4,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "inner()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { outer: { value: "\"Outer\"", status: "stable" }, inner: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "inner", variables: { innerVar: { value: "\"Inner\"", status: "stable" } } }
                    ],
                    output: ["Outer Inner"],
                    note: "Print outer + innerVar. outer found in Global scope."
                }
            ]
        },
        {
            title: "Closure",
            description: "A function remembers the variables from its lexical scope even when executed outside.",
            code: `function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const counter = createCounter();
console.log(counter());
console.log(counter());`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "new" }, counter: { value: "<TDZ>", status: "new" } } }],
                    note: "Creation Phase."
                },
                {
                    line: 7,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "<TDZ>", status: "stable" } } }],
                    note: "Call createCounter()."
                },
                {
                    line: 1,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "createCounter()", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "<TDZ>", status: "stable" } } },
                        { type: "Local", name: "createCounter", variables: { count: { value: "<TDZ>", status: "new" } } }
                    ],
                    note: "FEC (createCounter) Creation."
                },
                {
                    line: 2,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "createCounter()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "<TDZ>", status: "stable" } } },
                        { type: "Local", name: "createCounter", variables: { count: { value: "0", status: "changed" } } }
                    ],
                    note: "Initialize count = 0."
                },
                {
                    line: 4,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "createCounter()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "<TDZ>", status: "stable" } } },
                        { type: "Local", name: "createCounter", variables: { count: { value: "0", status: "stable" } } }
                    ],
                    note: "Return inner function (closure)."
                },
                {
                    line: 7,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "changed" } } }],
                    note: "counter assigned the returned function."
                },
                {
                    line: 8,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } }],
                    note: "Call counter() (1st time)."
                },
                {
                    line: 4,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "counter()", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } },
                        { type: "Closure", name: "Closure (createCounter)", variables: { count: { value: "0", status: "stable" } } },
                        { type: "Local", name: "counter", variables: {} }
                    ],
                    note: "FEC (counter) Creation. Closure scope active."
                },
                {
                    line: 5,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "counter()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } },
                        { type: "Closure", name: "Closure (createCounter)", variables: { count: { value: "1", status: "changed" } } },
                        { type: "Local", name: "counter", variables: {} }
                    ],
                    note: "Increment count (in Closure)."
                },
                {
                    line: 8,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } }],
                    output: ["1"],
                    note: "Return 1."
                },
                {
                    line: 9,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } }],
                    output: ["1"],
                    note: "Call counter() (2nd time)."
                },
                {
                    line: 4,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "counter()", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } },
                        { type: "Closure", name: "Closure (createCounter)", variables: { count: { value: "1", status: "stable" } } },
                        { type: "Local", name: "counter", variables: {} }
                    ],
                    note: "FEC (counter) Creation. Closure has count = 1."
                },
                {
                    line: 5,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "counter()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } },
                        { type: "Closure", name: "Closure (createCounter)", variables: { count: { value: "2", status: "changed" } } },
                        { type: "Local", name: "counter", variables: {} }
                    ],
                    note: "Increment count to 2."
                },
                {
                    line: 9,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { createCounter: { value: "fn()", status: "stable" }, counter: { value: "fn(inner)", status: "stable" } } }],
                    output: ["1", "2"],
                    note: "Return 2."
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
            }, 1500);
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
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Layers className="text-purple-400 w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Scope & <span className="text-purple-400">Hoisting</span>
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
                                    style.backgroundColor = 'rgba(168, 85, 247, 0.2)'; // purple-500/20
                                    style.borderLeft = '2px solid #a855f7'; // purple-500
                                }
                                return { style };
                            }}
                        >
                            {currentScenario.code}
                        </SyntaxHighlighter>
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="text-sm text-slate-400 mb-1">Current Step:</div>
                        <div className="text-purple-100 font-medium">{currentStep.note}</div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-center gap-4">
                        <button onClick={handleReset} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Reset">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button onClick={handlePrev} disabled={stepIndex === 0} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full bg-purple-500 hover:bg-purple-400 text-slate-900 transition-colors shadow-lg shadow-purple-500/20">
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

export default ScopeVisualizer;
