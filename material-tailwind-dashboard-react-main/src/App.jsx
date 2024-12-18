import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import SessionPage from "./pages/SessionPage";
import TeachersPage from "./pages/TeachersPage"
import ModulePages from "./pages/ModulePages";
function App() {
  return (
    <Routes>

<Route path="/departements/:departmentId/teachers" element={<TeachersPage />} />  {/* Dynamic path */}
<Route path="/modules/:optionId" element={<ModulePages />} />

      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/" element={<SessionPage />} />
    </Routes>
  );
}

export default App;
