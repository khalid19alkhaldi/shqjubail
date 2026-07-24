import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ClipboardList,
  Wrench,
  Building2,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { getNotifications, markNotificationsAsRead } from "@/lib/data-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  items: SidebarItem[];
}

export function PortalLayout({ children, title, items }: PortalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (user?.role) {
      setNotifications(getNotifications(user.role));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const handleMarkAllRead = () => {
    if (user?.role) {
      markNotificationsAsRead(user.role);
      setNotifications(getNotifications(user.role));
    }
  };

  const userName = user?.name || "مستخدم";
  const userRole = user?.role === "employee" ? "موظف" : "مقاول";
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden bg-primary-deep text-primary-foreground p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />
          <span className="font-bold text-sm">صيانة الجمعية</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 right-0 z-40 w-64 bg-primary-deep text-primary-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 hidden lg:flex items-center gap-3 border-b border-primary-foreground/10">
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
              <div>
                <div className="font-bold text-gold">صيانة</div>
                <div className="text-[10px] text-primary-foreground/60">تحفيظ القرآن بالجبيل</div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-white/10 [&.active]:bg-gold/20 [&.active]:text-gold"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-primary-foreground/10">
              <div className="flex items-center gap-3 mb-4 px-4">
                <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-gold" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold truncate">{userName}</div>
                  <div className="text-[10px] text-primary-foreground/60 truncate">{userRole}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-bold">تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex bg-white border-b border-border h-16 items-center justify-between px-8 sticky top-0 z-20">
            <h1 className="text-lg font-bold text-primary-deep">{title}</h1>
            <div className="flex items-center gap-4">
              <DropdownMenu onOpenChange={(open) => open && handleMarkAllRead()}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-elegant" dir="rtl">
                  <DropdownMenuLabel className="p-4 flex items-center justify-between">
                    <span className="font-bold text-primary-deep">التنبيهات</span>
                    {unreadCount > 0 && <Badge className="bg-red-100 text-red-600 border-none">{unreadCount} جديد</Badge>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map((n) => (
                      <DropdownMenuItem key={n.id} className="p-4 flex flex-col items-start gap-1 cursor-default focus:bg-secondary/20">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-sm">{n.title}</span>
                          <span className="text-[10px] text-muted-foreground">{n.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right">{n.desc}</p>
                        {n.unread && <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />}
                      </DropdownMenuItem>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-10 text-center text-muted-foreground text-sm">لا توجد تنبيهات حالياً.</div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 text-center justify-center text-xs font-bold text-primary cursor-pointer hover:bg-primary/5">
                    عرض كافة التنبيهات
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="h-8 w-px bg-border mx-2" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{userName}</span>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {userName[0]}
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-8 flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
