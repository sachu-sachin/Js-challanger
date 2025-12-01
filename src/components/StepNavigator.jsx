import { CheckCircle2, Circle, PlayCircle, BookOpen, Code2 } from "lucide-react";
import { cn } from "../lib/utils";

export function StepNavigator({ steps, currentStepIndex, completedStepIndex, onStepClick }) {
    return (
        <nav className="space-y-1">
            {steps.map((step, index) => {
                const isCompleted = index <= completedStepIndex;
                const isCurrent = index === currentStepIndex;
                const isLocked = index > completedStepIndex + 1;

                let Icon = Circle;
                if (step.type === 'theory') Icon = BookOpen;
                if (step.type === 'snippet') Icon = Code2;
                if (step.type === 'editor') Icon = PlayCircle;
                if (isCompleted) Icon = CheckCircle2;

                return (
                    <button
                        key={index}
                        onClick={() => !isLocked && onStepClick(index)}
                        disabled={isLocked}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all text-left group",
                            isCurrent
                                ? "bg-yellow-500/10 text-yellow-500 font-medium border border-yellow-500/20"
                                : isCompleted
                                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                                    : "text-gray-600 cursor-not-allowed"
                        )}
                    >
                        <span className={cn(
                            "flex-shrink-0 transition-colors",
                            isCurrent ? "text-yellow-500" : isCompleted ? "text-green-500" : "text-gray-700"
                        )}>
                            <Icon size={18} />
                        </span>
                        <span className="truncate">
                            {step.type === 'theory' && "Theory"}
                            {step.type === 'snippet' && "Example"}
                            {step.type === 'editor' && "Challenge"}
                        </span>

                        {isCurrent && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
