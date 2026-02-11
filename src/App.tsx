import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import QuizSetup from "./pages/QuizSetup";
import QuizFlow from "./pages/QuizFlow";
import WaitingScreen from "./pages/WaitingScreen";
import Results from "./pages/Results";
import JoinQuiz from "./pages/JoinQuiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz/new" element={<QuizSetup />} />
          <Route path="/quiz/play" element={<QuizFlow />} />
          <Route path="/quiz/waiting" element={<WaitingScreen />} />
          <Route path="/results" element={<Results />} />
          <Route path="/join/:shareCode" element={<JoinQuiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
