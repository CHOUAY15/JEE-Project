import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import SessionPage from "./pages/SessionPage";
import TeachersPage from "./pages/TeachersPage";
import ModulePages from "./pages/ModulePages";
import React from "react";

const RedirectToExternal = () => {
    // Trigger redirection to the external URL when this component is rendered
    React.useEffect(() => {
        window.location.href = "http://localhost:8080/realms/app-jee/protocol/openid-connect/auth?client_id=web-jee&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcallback&response_type=code&scope=openid%20profile%20email";
    }, []);

    return null; // No content to render, just perform the redirection
};

function App() {
    return (
        <Routes>
            <Route path="/departements/:departmentId/teachers" element={<TeachersPage />} />  {/* Dynamic path */}
            <Route path="/modules/:optionId" element={<ModulePages />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/dashboard/session" element={<SessionPage />} />

            <Route path="*" element={<Navigate to="/dashboard/session" replace />} />

            {/* Root path redirects to external URL */}
            <Route path="/" element={<RedirectToExternal />} />
        </Routes>
    );
}

export default App;
