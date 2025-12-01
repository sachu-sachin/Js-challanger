import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { TopicPage } from "./pages/TopicPage";
import { TaskPage } from "./pages/TaskPage";
import MemoryVisualizer from "./components/MemoryVisualizer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/topic/:topicId" element={<TopicPage />} />
      <Route path="/topic/:topicId/task/:taskId" element={<TaskPage />} />
      <Route path="/visualizer" element={<MemoryVisualizer />} />
    </Routes>
  );
}

export default App;
