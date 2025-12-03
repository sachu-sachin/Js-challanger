import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Box, Layers, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MemoryVisualizer = () => {
    const [step, setStep] = useState(0);

    // Scenario Definition
    const scenarios = [
        {
            title: "Introduction to JS Memory",
            subtitle: "The Two Realms",
            description: "In JavaScript (like Java), memory is divided into two main areas: the Stack and the Heap. The Stack is for static data (fixed size), and the Heap is for dynamic data (objects).",
            code: "// Memory is allocated automatically when you declare variables",
            stack: [],
            heap: [],
            javaNote: "Just like in Java: Primitives (int, boolean) go on the Stack. Objects (new Class()) go on the Heap.",
        },
        {
            title: "Primitives: Allocation",
            subtitle: "Stack Memory",
            description: "Primitive types (Number, String, Boolean, Null, Undefined, Symbol, BigInt) are stored directly on the Stack. They are simple and fast access.",
            code: "let score = 10;\nlet name = 'Alice';",
            stack: [
                { id: 'v1', name: 'score', value: '10', type: 'primitive', highlight: true },
                { id: 'v2', name: 'name', value: "'Alice'", type: 'primitive', highlight: true }
            ],
            heap: [],
            javaNote: "Equivalent to: int score = 10; String name = \"Alice\"; (Note: Java Strings are objects, but behave similarly to primitives due to immutability string pool, whereas JS strings are true primitives).",
        },
        {
            title: "Primitives: Copy by Value",
            subtitle: "Independent Copies",
            description: "When you assign a primitive variable to another, JS creates a distinct copy of the value. They do not share memory.",
            code: "let score = 10;\nlet newScore = score;",
            stack: [
                { id: 'v1', name: 'score', value: '10', type: 'primitive' },
                { id: 'v3', name: 'newScore', value: '10', type: 'primitive', highlight: true }
            ],
            heap: [],
            javaNote: "Like: int newScore = score; Changing newScore later won't affect score.",
        },
        {
            title: "Primitives: Independence",
            subtitle: "Changing the Copy",
            description: "Modifying the new variable does NOT affect the original. They live in different slots on the Stack.",
            code: "let score = 10;\nlet newScore = score;\n\nnewScore = 20;",
            stack: [
                { id: 'v1', name: 'score', value: '10', type: 'primitive' },
                { id: 'v3', name: 'newScore', value: '20', type: 'primitive', highlight: true, prevValue: '10' }
            ],
            heap: [],
            javaNote: "score remains 10. newScore becomes 20.",
        },
        {
            title: "Non-Primitives: The Heap",
            subtitle: "Reference Types",
            description: "Objects (Arrays, Functions, Objects) are too complex for the Stack. The data is stored in the Heap. The Stack variable only holds a 'Reference' (memory address).",
            code: "let user = {\n  name: 'John',\n  age: 30\n};",
            stack: [
                { id: 'v4', name: 'user', value: '#REF_101', type: 'reference', highlight: true }
            ],
            heap: [
                { id: 'h1', address: '#REF_101', data: "{ name: 'John', age: 30 }", highlight: true }
            ],
            javaNote: "Exactly like: User user = new User('John', 30); The variable 'user' holds the pointer.",
        },
        {
            title: "Non-Primitives: Copy by Reference",
            subtitle: "Sharing the Link",
            description: "When you assign an object to a new variable, you are copying the REFERENCE, not the data. Both variables now point to the EXACT SAME object.",
            code: "let user = { name: 'John' };\nlet admin = user;",
            stack: [
                { id: 'v4', name: 'user', value: '#REF_101', type: 'reference' },
                { id: 'v5', name: 'admin', value: '#REF_101', type: 'reference', highlight: true }
            ],
            heap: [
                { id: 'h1', address: '#REF_101', data: "{ name: 'John', age: 30 }" }
            ],
            javaNote: "User admin = user; Both references point to the same heap object.",
        },
        {
            title: "Non-Primitives: Mutation",
            subtitle: "Spooky Action at a Distance",
            description: "If you change the data via one variable, the other variable 'sees' the change too because they are looking at the same memory location.",
            code: "admin.age = 31;",
            stack: [
                { id: 'v4', name: 'user', value: '#REF_101', type: 'reference', highlight: true },
                { id: 'v5', name: 'admin', value: '#REF_101', type: 'reference', highlight: true }
            ],
            heap: [
                { id: 'h1', address: '#REF_101', data: "{ name: 'John', age: 31 }", highlight: true }
            ],
            javaNote: "Changing admin.age changes user.age. This is a common source of bugs!",
        },
        {
            title: "Arrays: Also Objects",
            subtitle: "Heap Allocation",
            description: "In JavaScript, Arrays are just specialized Objects. They live on the Heap. The variable holds the address, just like standard objects.",
            code: "let roles = ['User', 'Admin'];",
            stack: [
                { id: 'v_arr1', name: 'roles', value: '#REF_999', type: 'reference', highlight: true }
            ],
            heap: [
                { id: 'h_arr1', address: '#REF_999', data: "['User', 'Admin'] (length: 2)", highlight: true }
            ],
            javaNote: "Similar to Java arrays: String[] roles = {\"User\", \"Admin\"}; or ArrayLists. They reside on the Heap."
        },
        {
            title: "Arrays: Shared References",
            subtitle: "Mutation Affects All",
            description: "Because arrays are reference types, copying the variable only copies the pointer. Pushing data to the 'copy' changes the 'original'.",
            code: "let a = [10, 20];\nlet b = a;\n\nb.push(30);",
            stack: [
                { id: 'v_a', name: 'a', value: '#REF_888', type: 'reference' },
                { id: 'v_b', name: 'b', value: '#REF_888', type: 'reference', highlight: true }
            ],
            heap: [
                { id: 'h_arr2', address: '#REF_888', data: "[10, 20, 30]", highlight: true }
            ],
            javaNote: "Like: List<Integer> b = a; b.add(30); The underlying list is modified for everyone holding the reference."
        }
    ];

    const currentScenario = scenarios[step];

    const nextStep = () => {
        if (step < scenarios.length - 1) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const reset = () => {
        setStep(0);
    };

    // Helper to render connection lines
    const renderConnections = () => {
        return currentScenario.stack
            .filter(v => v.type === 'reference')
            .map((stackVar, index) => {
                // Calculate dynamic positions (approximations for demo)
                const startX = 250; // Right edge of stack card
                const startY = 60 + (index * 70); // Approximate vertical center of stack item

                // Find matching heap object
                const heapIndex = currentScenario.heap.findIndex(h => h.address === stackVar.value);
                if (heapIndex === -1) return null;

                const endX = 380; // Left edge of heap card
                const endY = 60 + (heapIndex * 100);

                return (
                    <svg key={`conn-${stackVar.id}`} className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-10">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#D4AF37" />
                            </marker>
                        </defs>
                        <motion.path
                            d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
                            stroke="#D4AF37"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                    </svg>
                );
            });
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-gray-100 font-sans overflow-hidden">
            {/* Header */}
            <header className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center shadow-md z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <Layers className="text-indigo-400 w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        JS Memory <span className="text-gold">Visualizer</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-300 bg-slate-700 px-3 py-1 rounded-full border border-slate-600">
                        Step {step + 1} / {scenarios.length}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={prevStep}
                            disabled={step === 0}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-600"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={step === scenarios.length - 1}
                            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                            <span>Next</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={reset}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 transition-colors border border-slate-600"
                            title="Restart"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Left Sidebar: Context & Code */}
                <div className="w-1/3 min-w-[350px] bg-slate-800 border-r border-slate-700 flex flex-col z-20 shadow-xl">
                    <div className="p-8 flex-1 overflow-y-auto">
                        <div className="mb-8">
                            <motion.div
                                key={currentScenario.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h2 className="text-2xl font-bold text-indigo-400 mb-2">{currentScenario.title}</h2>
                                <h3 className="text-lg text-gold mb-4 font-medium">{currentScenario.subtitle}</h3>
                                <p className="text-slate-300 leading-relaxed text-lg">{currentScenario.description}</p>
                            </motion.div>
                        </div>

                        {currentScenario.javaNote && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 bg-amber-950/30 border border-amber-500/30 rounded-xl p-5 flex gap-4 shadow-lg"
                            >
                                <div className="p-2 bg-amber-500/10 rounded-lg h-fit">
                                    <Box className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-amber-500 mb-1 uppercase tracking-wider">Java Developer Note</h4>
                                    <p className="text-sm text-amber-200/80 leading-relaxed">{currentScenario.javaNote}</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
                            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-xs text-slate-500 font-mono">script.js</span>
                            </div>
                            <pre className="p-5 font-mono text-sm text-slate-300 overflow-x-auto leading-loose">
                                <code>{currentScenario.code}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Right Area: Visualization */}
                <div className="flex-1 bg-slate-900 relative p-8 flex gap-16 justify-center items-start overflow-hidden">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                    </div>

                    {/* Connection Layer */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="relative w-full h-full max-w-5xl mx-auto flex gap-32">
                            <div className="w-64"></div> {/* Spacer for Stack */}
                            <div className="flex-1 relative">
                                {renderConnections()}
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-5xl flex gap-32 relative z-10 mt-10">

                        {/* STACK VISUALIZATION */}
                        <div className="w-64 flex flex-col gap-6">
                            <div className="text-center mb-2">
                                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xl mb-1">
                                    <Layers className="w-6 h-6" /> STACK
                                </div>
                                <div className="text-xs text-emerald-500/60 uppercase tracking-[0.2em] font-bold">Static Memory</div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 min-h-[450px] p-5 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl relative">
                                {currentScenario.stack.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm italic">
                                        Stack Empty
                                    </div>
                                )}
                                <AnimatePresence mode='popLayout'>
                                    {currentScenario.stack.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className={`
                                                relative p-4 rounded-xl border shadow-md group
                                                ${item.highlight
                                                    ? 'bg-emerald-900/30 border-emerald-500/50 shadow-emerald-500/10'
                                                    : 'bg-slate-700 border-slate-600'}
                                            `}
                                        >
                                            <div className="flex justify-between items-baseline mb-2">
                                                <span className="font-mono text-emerald-300 font-bold text-sm">{item.name}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">0x{1000 + idx * 4}</span>
                                            </div>
                                            <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50 font-mono text-center relative overflow-hidden">
                                                {item.prevValue && (
                                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-red-500/50 line-through text-xs">
                                                        {item.prevValue}
                                                    </span>
                                                )}
                                                <span className={item.type === 'reference' ? 'text-indigo-400 font-bold' : 'text-orange-300'}>
                                                    {item.value}
                                                </span>
                                            </div>
                                            {item.type === 'primitive' && (
                                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 translate-x-full pl-2 pointer-events-none">
                                                    <span className="text-[10px] text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded border border-slate-600">
                                                        Primitive
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* HEAP VISUALIZATION */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="text-center mb-2">
                                <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xl mb-1">
                                    <Database className="w-6 h-6" /> HEAP
                                </div>
                                <div className="text-xs text-indigo-500/60 uppercase tracking-[0.2em] font-bold">Dynamic Memory</div>
                            </div>

                            <div className="relative min-h-[450px] p-8 bg-slate-800 rounded-2xl border border-dashed border-slate-700 shadow-xl">
                                {currentScenario.heap.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm italic">
                                        Heap Empty
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-6">
                                    <AnimatePresence>
                                        {currentScenario.heap.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.4 }}
                                                className={`
                                                    p-5 rounded-xl border shadow-lg
                                                    ${item.highlight
                                                        ? 'bg-indigo-900/30 border-indigo-500/50 ring-1 ring-indigo-500/20'
                                                        : 'bg-slate-700 border-slate-600'}
                                                `}
                                            >
                                                <div className="flex items-center gap-3 mb-3 border-b border-slate-600/50 pb-3">
                                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded font-mono font-bold">Object</span>
                                                    <span className="text-xs text-slate-400 font-mono ml-auto">{item.address}</span>
                                                </div>
                                                <div className="font-mono text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                                    {item.data}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryVisualizer;