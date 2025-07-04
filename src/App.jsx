import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Main/Home";
import Layout from "./components/Layout";
// (You can add more pages like NewsPage, QuestPage, etc. later)
import Profile from "./pages/Profile/Profile";
import ProjectQuest from "./pages/Projects/ProjectQuest";
import Projects from "./pages/Projects/Projects";
import Quests from './pages/Quests/Quests';
import ProjectDetail from './pages/Projects/ProjectDetail';
import CreateProfile from "./pages/Profile/CreateProfile";
import TwitterCallback from "./pages/Auth/TwitterCallback";
import OAuthSuccess from "./pages/OAuthSuccess";
// inside <Routes>...


export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          

          <Route path="/quests/:questId" element={<ProjectQuest />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
<Route path="/auth/twitter/callback" element={<TwitterCallback />} />
<Route path="/oauth-success" element={<OAuthSuccess />} />

<Route path="/quests" element={<Quests />} />
<Route path="/projects" element={<Projects />} />
          <Route path="/" element={<Home />} />
          {/* Example for future expansion: */}
          {/* <Route path="/news" element={<NewsPage />} /> */}
          {/* <Route path="/quests" element={<QuestsPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}
