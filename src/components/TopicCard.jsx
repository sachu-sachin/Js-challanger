import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

export function TopicCard({ topic }) {
    const Icon = Icons[topic.icon] || Icons.Box;

    return (
        <Link
            to={`/topic/${topic.id}`}
            className="group block p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all duration-200"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-800 text-indigo-400 rounded-lg group-hover:bg-gray-700 transition-colors">
                    <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 group-hover:text-indigo-400 transition-colors">
                    {topic.title}
                </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
                {topic.description}
            </p>
        </Link>
    );
}
