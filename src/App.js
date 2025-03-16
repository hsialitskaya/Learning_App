import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PreferencesProvider } from "./app_preferences/preferences-context";
import StartPage from "./start/StartPage";
import LoginPage from "./login/LoginPage";
import AdminLoginPage from "./administrate/login/LoginPage";
import RegisterPage from "./register/RegisterPage";
import ResetPasswordPage from "./reset_password/ResetPasswordPage";
import MainPage from "./main/MainPage";
import ProfilePage from "./profile_data/ProfilePage";
import EditProfilePage from "./profile_update/EditProfilePage";
import PreferencesPage from "./study_preferences/PreferencesPage";
import EditPreferencesPage from "./preferences_update/EditPreferencesPage";
import CoursesPage from "./courses_search/CoursesPage";
import CourseDetailPage from "./courses_details/CourseDetailPage";
import MyCoursesPage from "./my_courses/MyCoursesPage";
import ProgressTrackingPage from "./progress/ProgressTrackingPage";
import AppPreferencesPage from "./app_preferences/UserPreferences";
import FeedbackCoursePage from "./feedback/FeedbackCoursePage";
import FeedbackInstructorPage from "./feedback/FeedbackInstructorPage";
import AdminPage from "./administrate/AdminPanel";
import DeletePage from "./delete/DeletePage";
import CoursesModulePage from "./courses_modules/CoursesModulePage";
import LessonPage from "./lessons/LessonPage";
import QuizPage from "./quiz/QuizPage";
import DiscussionPage from "./discussion/DiscussionPage";
import TestsPage from "./tests/TestsPage";
import TestCreatePage from "./tests_create/TestCreatePage";
import EffectivePage from "./effective/EffectivePage";
import CoursesCreatorPage from "./courses_creator/CoursesCreatorPage";
import MyCoursesAnalyticsPage from "./my_courses_analytics/MyCoursesAnalyticsPage";
import CoursesManagement from "./administrate/CoursesManagement";
import UsersManagement from "./administrate/UsersManagement";
import Settings from "./administrate/Settings";

function App() {
  return (
    <PreferencesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin_login" element={<AdminLoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/study_preferences" element={<PreferencesPage />} />
          <Route path="/edit-preferences" element={<EditPreferencesPage />} />
          <Route path="/courses-search" element={<CoursesPage />} />
          <Route path="/courses-search/:id" element={<CourseDetailPage />} />
          <Route path="/my_courses" element={<MyCoursesPage />} />
          <Route path="/my_courses/:courseId" element={<CoursesModulePage />} />
          <Route
            path="/my_courses/:courseId/:lessonId"
            element={<LessonPage />}
          />
          <Route path="/progress" element={<ProgressTrackingPage />} />
          <Route path="/app_preferences" element={<AppPreferencesPage />} />
          <Route
            path="/courses-search/:courseId/feedback-course"
            element={<FeedbackCoursePage />}
          />
          <Route
            path="/courses-search/:courseId/feedback-instructor"
            element={<FeedbackInstructorPage />}
          />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/delete-profile" element={<DeletePage />} />
          <Route path="/quiz/:courseId" element={<QuizPage />} />
          <Route path="/discussions" element={<DiscussionPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test-create" element={<TestCreatePage />} />
          <Route path="/effective" element={<EffectivePage />} />
          <Route path="/course_creator" element={<CoursesCreatorPage />} />
          <Route path="/my_analytics" element={<MyCoursesAnalyticsPage />} />
          <Route path="/admin/courses" element={<CoursesManagement />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Routes>
      </Router>
    </PreferencesProvider>
  );
}

export default App;
