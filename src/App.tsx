import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import LabelPage from "./pages/LabelPage.tsx";
import PostPage from "./pages/PostPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import ThemeDownloadPage from "./pages/ThemeDownloadPage.tsx";
import ThemePreviewPage from "./pages/ThemePreviewPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/label/:label" element={<LabelPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/theme-download" element={<ThemeDownloadPage />} />
          <Route path="/theme-preview" element={<ThemePreviewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
