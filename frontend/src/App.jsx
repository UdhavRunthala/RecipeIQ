import { useState } from "react";
import Layout from "./components/layout/Layout";
import PantryPage from "./pages/PantryPage";
import CookTodayPage from "./pages/CookTodayPage";
import MealLogPage from "./pages/MealLogPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";

function App() {
  const [activePath, setActivePath] = useState("/pantry");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  function handleViewRecipe(id) {
    setSelectedRecipeId(id);
    setActivePath("/recipe-detail");
  }

  function renderPage() {
    switch (activePath) {
      case "/pantry":
        return <PantryPage />;
      case "/cook-today":
        return <CookTodayPage onViewRecipe={handleViewRecipe} />;
      case "/meal-log":
        return <MealLogPage />;
      case "/recipe-detail":
        return <RecipeDetailPage recipeId={selectedRecipeId} onBack={() => setActivePath("/cook-today")} />;
      default:
        return <div className="text-gray-400 text-sm">This page hasn't been built yet.</div>;
    }
  }

  return (
    <Layout activePath={activePath} onNavigate={setActivePath}>
      {renderPage()}
    </Layout>
  );
}

export default App;