// File: src/router/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Main/Home';
import NewsDetail from '../pages/Main/NewsDetail';
import QuestsPage from '../pages/Quests/QuestsPage';
import ProjectList from '../pages/Projects/ProjectList';
import ProjectDetail from '../pages/Projects/ProjectDetail';
import ProfileView from '../pages/Profile/ProfileView';
import ProfileEdit from '../pages/Profile/ProfileEdit';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
