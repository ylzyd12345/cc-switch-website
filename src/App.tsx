import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageProvider";
import NotFound from "./pages/NotFound";

const CCSwitchHome = lazy(() => import("./pages/CCSwitchHome"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      加载中...
    </div>
  );
}

const App = () => (
  <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<CCSwitchHome />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  </LanguageProvider>
);

export default App;
