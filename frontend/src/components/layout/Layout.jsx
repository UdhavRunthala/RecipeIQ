import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ activePath, onNavigate, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath={activePath} onNavigate={onNavigate} />
      <div className="ml-64">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}