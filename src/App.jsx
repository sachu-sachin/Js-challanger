import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { TopicPage } from "./pages/TopicPage";
import { TaskPage } from "./pages/TaskPage";
import MemoryVisualizer from "./components/MemoryVisualizer";
import ConditionalVisualizer from "./components/ConditionalVisualizer";
import LoopVisualizer from "./components/LoopVisualizer";
import ScopeVisualizer from "./components/ScopeVisualizer";
import FunctionVisualizer from "./components/FunctionVisualizer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/topic/:topicId" element={<TopicPage />} />
      <Route path="/topic/:topicId/task/:taskId" element={<TaskPage />} />
      <Route path="/visualizer/memory" element={<MemoryVisualizer />} />
      <Route path="/visualizer/loop" element={<LoopVisualizer />} />
      <Route path="/visualizer/conditional" element={<ConditionalVisualizer />} />
      <Route path="/visualizer/scope" element={<ScopeVisualizer />} />
      <Route path="/visualizer/function" element={<FunctionVisualizer />} />
    </Routes>
  );
}

export default App;
