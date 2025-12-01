import { Link, useParams } from "react-router-dom";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "../lib/utils";

export function TaskSidebar({ topic, tasks }) {
    const { taskId } = useParams();

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 hidden md:block">
            <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold text-gray-100">{topic.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{tasks.length} tasks</p>
            </div>
            <nav className="p-2">
                <ul className="space-y-1">
                    {tasks.map((task, index) => {
                        const isActive = task.id === taskId;
                        return (
                            <li key={task.id}>
                                <Link
                                    to={`/topic/${topic.id}/task/${task.id}`}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                        isActive
                                            ? "bg-indigo-500/10 text-indigo-400 font-medium"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                    )}
                                >
                                    <span className="flex-shrink-0">
                                        {/* Placeholder for completion status */}
                                        <Circle size={16} className={cn(isActive ? "text-indigo-400" : "text-gray-600")} />
                                    </span>
                                    <span className="truncate">
                                        {index + 1}. {task.title}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
