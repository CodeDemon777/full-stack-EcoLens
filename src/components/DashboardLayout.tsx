import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <AppSidebar />
      <main className="ml-16 min-h-screen p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
