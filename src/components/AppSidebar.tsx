import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Factory,
  Layers,
  TrendingUp,
  Lightbulb,
  FileText,
  FlaskConical,
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: Factory, label: "Emissions", path: "/dashboard/emissions" },
  { icon: Layers, label: "Scope Analysis", path: "/dashboard/scope" },
  { icon: TrendingUp, label: "Predictions", path: "/dashboard/predictions" },
  { icon: Lightbulb, label: "Recommendations", path: "/dashboard/recommendations" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports" },
  { icon: FlaskConical, label: "Digital Twin", path: "/dashboard/twin" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign out";
      toast.error(message);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 hover:w-56 flex-col border-r border-border bg-sidebar transition-all duration-300 group overflow-hidden">
      <div className="flex h-16 items-center gap-3 px-4 border-b border-border">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Factory className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display text-sm font-semibold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          EcoLens
        </span>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
