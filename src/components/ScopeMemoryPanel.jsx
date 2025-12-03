import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database } from 'lucide-react';

const ScopeMemoryPanel = ({ scopes }) => {
    return (
        <div className="flex-1 flex flex-col bg-slate-900/30 min-h-0">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Scope Chain & Memory</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <AnimatePresence>
                    {scopes.map((scope, index) => (
                        <motion.div
                            key={`${scope.type}-${scope.name}-${index}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-6"
                        >
                            {/* Scope Connector Line */}
                            {index < scopes.length - 1 && (
                                <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-slate-700/50"></div>
                            )}

                            {/* Scope Node */}
                            <div className="absolute left-0 top-3 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center z-10">
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            </div>

                            <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${scope.type === 'Global' ? 'bg-slate-900/80 border-slate-700' :
                                scope.type === 'Closure' ? 'bg-purple-900/10 border-purple-500/30' :
                                    scope.type === 'Block' ? 'bg-blue-900/10 border-blue-500/30' :
                                        'bg-slate-800 border-slate-600'
                                }`}>
                                <div className={`px-4 py-2 border-b flex justify-between items-center ${scope.type === 'Global' ? 'bg-slate-800 border-slate-700' :
                                    scope.type === 'Closure' ? 'bg-purple-900/20 border-purple-500/20' :
                                        scope.type === 'Block' ? 'bg-blue-900/20 border-blue-500/20' :
                                            'bg-slate-700 border-slate-600'
                                    }`}>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${scope.type === 'Global' ? 'text-slate-400' :
                                        scope.type === 'Closure' ? 'text-purple-400' :
                                            scope.type === 'Block' ? 'text-blue-400' :
                                                'text-slate-300'
                                        }`}>
                                        {scope.type} Scope: {scope.name}
                                    </span>
                                    {scope.type === 'Closure' && <Database className="w-3 h-3 text-purple-400" />}
                                </div>
                                <div className="p-3 space-y-2">
                                    {Object.entries(scope.variables).map(([key, varData]) => {
                                        // Handle both old (string) and new (object) formats
                                        const value = typeof varData === 'object' && varData !== null ? varData.value : varData;
                                        const status = typeof varData === 'object' && varData !== null ? varData.status : 'stable'; // 'new', 'changed', 'stable'

                                        return (
                                            <motion.div
                                                key={key}
                                                initial={status === 'new' ? { scale: 0.9, opacity: 0 } : false}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className={`flex justify-between items-center font-mono text-sm p-2 rounded transition-colors duration-500 ${status === 'new' ? 'bg-blue-500/10 border border-blue-500/30' :
                                                        status === 'changed' ? 'bg-red-500/10 border border-red-500/30' :
                                                            'border border-transparent'
                                                    }`}
                                            >
                                                <span className="text-slate-400 font-semibold">{key}:</span>
                                                <motion.span
                                                    key={`${key}-${value}`} // Trigger animation on value change
                                                    initial={status === 'changed' ? { scale: 1.2, color: '#f87171' } : false}
                                                    animate={{ scale: 1, color: getValueColor(value) }}
                                                    transition={{ duration: 0.3 }}
                                                    className="font-medium"
                                                >
                                                    {value}
                                                </motion.span>
                                            </motion.div>
                                        );
                                    })}
                                    {Object.keys(scope.variables).length === 0 && (
                                        <div className="text-slate-600 italic text-xs">Empty</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Helper to determine text color based on value type
const getValueColor = (value) => {
    if (value === 'undefined') return '#64748b'; // slate-500
    if (value === '<uninitialized>' || value === '<TDZ>') return '#f87171'; // red-400
    if (typeof value === 'string' && value.startsWith('fn(')) return '#60a5fa'; // blue-400
    return '#4ade80'; // green-400
};

export default ScopeMemoryPanel;
