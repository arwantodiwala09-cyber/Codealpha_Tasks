import { useEffect, useState, useCallback } from "react";

import { useAuth } from "../hooks/useAuth";

import DashboardLayout from "../layout/DashboardLayout";

import QuickActions from "../components/dashboard/QuickActions";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import MemberDashboard from "../components/dashboard/MemberDashboard";
import Navbar from "../components/Navbar";

import { PageLoader } from "../components/ui/LoadingSpinner";

import {
  getProjects,
  createProject,
} from "../services/projectService";

import {
  getMyTasks,
} from "../services/taskService";

import {
  getAnalytics,
} from "../services/analyticsService";
import DashboardHero from "../components/dashboard/hero/DashboardHero";

export default function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const requests = [
        getProjects(),
        getMyTasks(),
      ];

      if (user.role === "Admin") {
        requests.push(getAnalytics());
      }

      const result = await Promise.all(requests);

      const projectsData = result[0];
      const tasksData = result[1];

      const analyticsData =
        user.role === "Admin"
          ? result[2]
          : null;

      setProjects(projectsData);
      setTasks(tasksData);
      setAnalytics(analyticsData);
          } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      await loadDashboard();
    } catch (error) {
      console.error("Create Project Error:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <PageLoader text="Loading Dashboard..." />
        </div>
      </DashboardLayout>
    );
  }
   return (
  <DashboardLayout>

    <Navbar />

    <div className="mt-8">
      <DashboardHero
        user={user}
        projects={projects}
        tasks={tasks}
      />
    </div>

    <div className="mt-8">
      <QuickActions />
    </div>

    <div className="mt-8">
      {user?.role === "Admin" ? (
        <AdminDashboard
          analytics={analytics}
          projects={projects}
          tasks={tasks}
        />
      ) : (
        <MemberDashboard
          projects={projects}
          tasks={tasks}
          onCreateProject={handleCreateProject}
        />
      )}
    </div>

  </DashboardLayout>
);
}