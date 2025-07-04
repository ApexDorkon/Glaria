// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Main/Home";
import Profile from "./pages/Profile/Profile";
import ProjectQuest from "./pages/Projects/ProjectQuest";
import Projects from "./pages/Projects/Projects";
import Quests from "./pages/Quests/Quests";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import CreateProfile from "./pages/Profile/CreateProfile";
import TwitterCallback from "./pages/Auth/TwitterCallback";
import OAuthSuccess from "./pages/OAuthSuccess";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/quests/:questId" element={<ProjectQuest />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/auth/twitter/callback" element={<TwitterCallback />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/create-profile" element={<CreateProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}