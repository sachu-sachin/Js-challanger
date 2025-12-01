import { useState, useEffect } from "react";
import { Play, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../lib/utils";

import { ASTValidator } from "../utils/ASTValidator";
import { LoopProtector } from "../utils/LoopProtector";

export function TestRunner({ code, tests, onReset, functionName, parameters, patterns, validate, onSuccess }) {
    const [results, setResults] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);

    const runCode = () => {
        setResults(null);
        setLogs([]);
        setError(null);

        try {
            // 1. AST Validation (New)
            if (validate && validate.requirements) {
                const validator = new ASTValidator(code);
                const { valid, errors } = validator.validate(validate.requirements);
                if (!valid) {
                    throw new Error(errors[0]); // Throw the first error found
                }
            }

            // 2. Strict Regex Validation (Legacy/Fallback)
            if (patterns) {
                // Normalize whitespace: remove newlines and extra spaces
                const normalizedCode = code.replace(/\s+/g, ' ');

                if (patterns.required) {
                    for (const pattern of patterns.required) {
                        const regex = new RegExp(pattern);
                        if (!regex.test(code)) {
                            throw new Error(`Code must contain pattern: ${pattern}`);
                        }
                    }
                }

                if (patterns.forbidden) {
                    for (const pattern of patterns.forbidden) {
                        const regex = new RegExp(pattern);
                        if (regex.test(code)) {
                            throw new Error(`Code must not contain pattern: ${pattern}`);
                        }
                    }
                }
            }

            const testResults = tests.map((test, index) => {
                const capturedLogs = [];

                // Create a safe context for execution
                // We'll wrap the user code in a function that returns the logs
                // We also inject any input variables defined in the test

                // Prepare input variables declaration
                let inputSetup = "";
                if (test.input && Array.isArray(test.input)) {
                    // Assuming input is an array of values corresponding to parameters
                    // But since we are moving away from functions, we might need named inputs
                    // For now, let's assume the JSON defines inputs as objects or we map them if parameters exist

                    if (parameters && parameters.length > 0) {
                        test.input.forEach((val, i) => {
                            const paramName = parameters[i];
                            const valStr = JSON.stringify(val);
                            inputSetup += `let ${paramName} = ${valStr};\n`;
                        });
                    }
                }


                // Protect against infinite loops
                const protector = new LoopProtector();
                const protectedCode = protector.protect(code);

                const body = `
                    const capturedLogs = [];
                    const console = {
                        log: (...args) => {
                            capturedLogs.push(args.map(arg => {
                                if (typeof arg === 'object') return JSON.stringify(arg);
                                return String(arg);
                            }).join(" "));
                        }
                    };
                    
                    // Loop protection
                    const _startTime = Date.now();
                    let _loopCounter = 0;
                    const _checkLoop = () => {
                        _loopCounter++;
                        if (_loopCounter > 10000) {
                             const _currentTime = Date.now();
                             if (_currentTime - _startTime > 2000) {
                                 throw new Error("Infinite loop detected (execution time limit exceeded)");
                             }
                             // Reset counter to avoid overhead on every iteration if time is fine, 
                             // but actually we want to catch tight loops too.
                             // Let's just use a high counter limit for tight loops.
                             if (_loopCounter > 1000000) {
                                 throw new Error("Infinite loop detected (iteration limit exceeded)");
                             }
                        }
                    };

                    try {
                        ${inputSetup}
                        ${protectedCode}
                    } catch (e) {
                        throw e;
                    }
                    
                    return capturedLogs;
                `;

                try {
                    const runner = new Function(body);
                    const resultLogs = runner();

                    // Compare logs with expected output
                    // Expected output should be an array of strings
                    const expectedLogs = Array.isArray(test.output) ? test.output.map(String) : [String(test.output)];

                    // Check if logs match
                    const passed = JSON.stringify(resultLogs) === JSON.stringify(expectedLogs);

                    return {
                        input: test.input,
                        expected: expectedLogs.join("\n"),
                        actual: resultLogs.join("\n"),
                        passed,
                    };
                } catch (err) {
                    return {
                        input: test.input,
                        expected: Array.isArray(test.output) ? test.output.join("\n") : String(test.output),
                        actual: err.message,
                        passed: false,
                        error: true
                    };
                }
            });

            setResults(testResults);

            // Also run the code once "normally" to show output in the console window (using the first test case or default)
            // This is just for the "Output" section
            if (testResults.length > 0 && !testResults[0].error) {
                setLogs(testResults[0].actual.split("\n"));
            }

            const allPassed = testResults.every(r => r.passed);
            if (allPassed && onSuccess) {
                onSuccess();
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-800">
                <h3 className="font-medium text-gray-200">Console & Tests</h3>
                <div className="flex gap-2">
                    <button
                        onClick={onReset}
                        className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md transition-colors"
                        title="Reset Code"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={runCode}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <Play size={16} /> Run
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
                {error && (
                    <div className="p-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-md">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {logs.length > 0 && (
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Output</div>
                        {logs.map((log, i) => (
                            <div key={i} className="text-gray-300 border-l-2 border-gray-700 pl-2">
                                {log}
                            </div>
                        ))}
                    </div>
                )}

                {results && (
                    <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Test Results</div>
                        {results.map((result, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "p-3 rounded-md border flex items-start gap-3",
                                    result.passed
                                        ? "bg-green-900/20 border-green-900/50"
                                        : "bg-red-900/20 border-red-900/50"
                                )}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {result.passed ? (
                                        <CheckCircle2 size={18} className="text-green-500" />
                                    ) : (
                                        <XCircle size={18} className="text-red-500" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="font-medium text-gray-200">
                                        Test {i + 1}: {result.passed ? "Passed" : "Failed"}
                                    </div>
                                    {!result.passed && (
                                        <div className="text-xs text-gray-400 space-y-1">
                                            <div>Input: <code className="bg-gray-800 px-1 rounded border border-gray-700">{JSON.stringify(result.input)}</code></div>
                                            <div>Expected: <code className="bg-gray-800 px-1 rounded border border-gray-700">{JSON.stringify(result.expected)}</code></div>
                                            <div>Got: <code className="bg-gray-800 px-1 rounded border border-gray-700">{JSON.stringify(result.actual)}</code></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!results && !error && logs.length === 0 && (
                    <div className="text-gray-500 italic text-center mt-10">
                        Click "Run" to execute your code
                    </div>
                )}
            </div>
        </div>
    );
}
