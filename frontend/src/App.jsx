import { useState } from "react";
import Layout from "./components/layout/Layout";
import PantryPage from "./pages/PantryPage";

function App() {
  const [activePath, setActivePath] = useState("/pantry");

  function renderPage() {
    switch (activePath) {
      case "/pantry":
        return <PantryPage />;
      default:
        return (
          <div className="text-gray-400 text-sm">
            This page hasn't been built yet.
          </div>
        );
    }
  }

  return (
    <Layout activePath={activePath} onNavigate={setActivePath}>
      {renderPage()}
    </Layout>
  );
}

export default App;