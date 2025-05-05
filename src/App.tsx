
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import LeadsDashboard from "@/pages/LeadsDashboard";
import AccountSettings from "@/pages/AccountSettings";
import ClientIntakeForm from "@/pages/ClientIntakeForm";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import LawFirmPage from "@/pages/LawFirmPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Law Firm Public Routes */}
            <Route path="/:slug" element={<LawFirmPage />} />
            <Route path="/:slug/intake" element={<ClientIntakeForm />} />
            
            {/* Law Firm Protected Routes - Root redirects to leads */}
            <Route path="/:slug/back" element={
              <ProtectedRoute>
                <Navigate to="../back/leads" replace />
              </ProtectedRoute>
            } />
            
            <Route path="/:slug/back/leads" element={
              <ProtectedRoute>
                <LeadsDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/:slug/back/account" element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/manage" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<Navigate to="/manage" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
