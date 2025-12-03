import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Play, Pause, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ScopeMemoryPanel from './ScopeMemoryPanel';
import CallStackPanel from './CallStackPanel';

const FunctionVisualizer = () => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const scenarios = [
        {
            title: "Function Declaration",
            description: "Standard function definition. Can be called before declaration (Hoisted).",
            code: `console.log(greet("Alice"));
function greet(name) {
  return "Hello " + name;
}`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { greet: { value: "fn()", status: "new" } } }],
                    note: "Creation Phase: 'greet' is hoisted."
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { greet: { value: "fn()", status: "stable" } } }],
                    note: "Execution: Call greet('Alice')."
                },
                {
                    line: 2,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "greet('Alice')", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { greet: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "greet", variables: { name: { value: "\"Alice\"", status: "new" } } }
                    ],
                    note: "FEC (greet) Creation. Parameter 'name' initialized."
                },
                {
                    line: 3,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "greet('Alice')", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { greet: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "greet", variables: { name: { value: "\"Alice\"", status: "stable" } } }
                    ],
                    note: "Return 'Hello Alice'."
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { greet: { value: "fn()", status: "stable" } } }],
                    output: ["Hello Alice"],
                    note: "Print result."
                }
            ]
        },
        {
            title: "Function Expression",
            description: "Function assigned to a variable. Cannot be called before definition.",
            code: `const add = function(a, b) {
  return a + b;
};
console.log(add(2, 3));`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { add: { value: "<TDZ>", status: "new" } } }],
                    note: "Creation: 'add' is hoisted but in TDZ."
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { add: { value: "fn()", status: "changed" } } }],
                    note: "Execution: 'add' assigned the function."
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { add: { value: "fn()", status: "stable" } } }],
                    note: "Call add(2, 3)."
                },
                {
                    line: 1,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "add(2, 3)", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { add: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "add", variables: { a: { value: "2", status: "new" }, b: { value: "3", status: "new" } } }
                    ],
                    note: "FEC (add) Creation. Params initialized."
                },
                {
                    line: 2,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "add(2, 3)", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { add: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "add", variables: { a: { value: "2", status: "stable" }, b: { value: "3", status: "stable" } } }
                    ],
                    note: "Return 2 + 3 = 5."
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { add: { value: "fn()", status: "stable" } } }],
                    output: ["5"],
                    note: "Print result."
                }
            ]
        },
        {
            title: "Arrow Function",
            description: "Concise syntax. Implicit return for single expressions.",
            code: `const multiply = (x, y) => x * y;
console.log(multiply(4, 5));`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { multiply: { value: "<TDZ>", status: "new" } } }],
                    note: "Creation: 'multiply' in TDZ."
                },
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { multiply: { value: "fn()", status: "changed" } } }],
                    note: "Execution: 'multiply' assigned."
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { multiply: { value: "fn()", status: "stable" } } }],
                    note: "Call multiply(4, 5)."
                },
                {
                    line: 1,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "multiply(4, 5)", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { multiply: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "multiply", variables: { x: { value: "4", status: "new" }, y: { value: "5", status: "new" } } }
                    ],
                    note: "FEC (multiply) Creation."
                },
                {
                    line: 1,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "multiply(4, 5)", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { multiply: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "multiply", variables: { x: { value: "4", status: "stable" }, y: { value: "5", status: "stable" } } }
                    ],
                    note: "Implicit return x * y."
                },
                {
                    line: 2,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { multiply: { value: "fn()", status: "stable" } } }],
                    output: ["20"],
                    note: "Print result."
                }
            ]
        },
        {
            title: "Default Parameters",
            description: "Parameters can have default values if not provided.",
            code: `function welcome(user = "Guest") {
  console.log("Welcome " + user);
}
welcome("John");
welcome();`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { welcome: { value: "fn()", status: "new" } } }],
                    note: "Creation: 'welcome' hoisted."
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { welcome: { value: "fn()", status: "stable" } } }],
                    note: "Call welcome('John')."
                },
                {
                    line: 1,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "welcome('John')", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { welcome: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "welcome", variables: { user: { value: "\"John\"", status: "new" } } }
                    ],
                    note: "FEC Creation. user = 'John'."
                },
                {
                    line: 2,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "welcome('John')", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { welcome: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "welcome", variables: { user: { value: "\"John\"", status: "stable" } } }
                    ],
                    output: ["Welcome John"],
                    note: "Print message."
                },
                {
                    line: 5,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { welcome: { value: "fn()", status: "stable" } } }],
                    output: ["Welcome John"],
                    note: "Call welcome() without args."
                },
                {
                    line: 1,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "welcome()", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { welcome: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "welcome", variables: { user: { value: "\"Guest\"", status: "new" } } }
                    ],
                    note: "FEC Creation. user defaults to 'Guest'."
                },
                {
                    line: 2,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "welcome()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { welcome: { value: "fn()", status: "stable" } } },
                        { type: "Local", name: "welcome", variables: { user: { value: "\"Guest\"", status: "stable" } } }
                    ],
                    output: ["Welcome John", "Welcome Guest"],
                    note: "Print message."
                }
            ]
        },
        {
            title: "Return Value",
            description: "Functions return undefined by default if no return statement is used.",
            code: `function doNothing() {
  let x = 10;
}
let result = doNothing();
console.log(result);`,
            steps: [
                {
                    line: 1,
                    stack: [{ name: "Global Execution Context", phase: "Creation" }],
                    scopes: [{ type: "Global", name: "Global", variables: { doNothing: { value: "fn()", status: "new" }, result: { value: "<TDZ>", status: "new" } } }],
                    note: "Creation Phase."
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { doNothing: { value: "fn()", status: "stable" }, result: { value: "<TDZ>", status: "stable" } } }],
                    note: "Call doNothing()."
                },
                {
                    line: 1,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "doNothing()", phase: "Creation" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { doNothing: { value: "fn()", status: "stable" }, result: { value: "<TDZ>", status: "stable" } } },
                        { type: "Local", name: "doNothing", variables: { x: { value: "<TDZ>", status: "new" } } }
                    ],
                    note: "FEC Creation."
                },
                {
                    line: 2,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "doNothing()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { doNothing: { value: "fn()", status: "stable" }, result: { value: "<TDZ>", status: "stable" } } },
                        { type: "Local", name: "doNothing", variables: { x: { value: "10", status: "changed" } } }
                    ],
                    note: "Execute body. x = 10."
                },
                {
                    line: 3,
                    stack: [
                        { name: "Global Execution Context", phase: "Execution" },
                        { name: "doNothing()", phase: "Execution" }
                    ],
                    scopes: [
                        { type: "Global", name: "Global", variables: { doNothing: { value: "fn()", status: "stable" }, result: { value: "<TDZ>", status: "stable" } } },
                        { type: "Local", name: "doNothing", variables: { x: { value: "10", status: "stable" } } }
                    ],
                    note: "End of function. Implicit return undefined."
                },
                {
                    line: 4,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { doNothing: { value: "fn()", status: "stable" }, result: { value: "undefined", status: "changed" } } }],
                    note: "Assign undefined to result."
                },
                {
                    line: 5,
                    stack: [{ name: "Global Execution Context", phase: "Execution" }],
                    scopes: [{ type: "Global", name: "Global", variables: { doNothing: { value: "fn()", status: "stable" }, result: { value: "undefined", status: "stable" } } }],
                    output: ["undefined"],
                    note: "Print result."
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
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <Code className="text-green-400 w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Function <span className="text-green-400">Visualizer</span>
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
                                    style.backgroundColor = 'rgba(34, 197, 94, 0.2)'; // green-500/20
                                    style.borderLeft = '2px solid #22c55e'; // green-500
                                }
                                return { style };
                            }}
                        >
                            {currentScenario.code}
                        </SyntaxHighlighter>
                    </div>

                    <div className="p-4 border-t border-slate-800 bg-slate-900">
                        <div className="text-sm text-slate-400 mb-1">Current Step:</div>
                        <div className="text-green-100 font-medium">{currentStep.note}</div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-center gap-4">
                        <button onClick={handleReset} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Reset">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button onClick={handlePrev} disabled={stepIndex === 0} className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full bg-green-500 hover:bg-green-400 text-slate-900 transition-colors shadow-lg shadow-green-500/20">
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
                    <ScopeMemoryPanel scopes={currentStep.scopes || []} />
                </div>

            </div>
        </div>
    );
};

export default FunctionVisualizer;
