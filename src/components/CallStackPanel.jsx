import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CallStackPanel = ({ stack }) => {
    return (
        <div className="flex-1 flex flex-col bg-slate-950 min-h-0 border-r border-slate-800">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Call Stack</h2>
                <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">LIFO</span>
            </div>
            <div className="flex-1 p-6 flex flex-col-reverse justify-start gap-4 overflow-y-auto">
                <AnimatePresence mode='popLayout'>
                    {stack.map((frame, index) => (
                        <motion.div
                            key={`${frame.name}-${index}`}
                            layout
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`p-4 rounded-xl border-2 shadow-lg ${index === stack.length - 1
                                ? 'bg-indigo-500/10 border-indigo-500 shadow-indigo-500/10'
                                : 'bg-slate-800 border-slate-700'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-bold ${index === stack.length - 1 ? 'text-indigo-400' : 'text-slate-300'}`}>
                                    {frame.name}
                                </h3>
                                {index === stack.length - 1 && (
                                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                        Active
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500">Phase:</span>
                                <span className={`font-mono px-1.5 py-0.5 rounded ${frame.phase === 'Creation'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    }`}>
                                    {frame.phase}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {stack.length === 0 && (
                    <div className="text-center text-slate-600 italic mt-10">Stack is empty</div>
                )}
            </div>
        </div>
    );
};

export default CallStackPanel;
