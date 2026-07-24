import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/employee/orders")({
  beforeLoad: () => {
    const savedUser = localStorage.getItem("shq_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (!user || user.role !== "employee") {
      throw redirect({ to: "/employee/login" });
    }
  },
  component: () => (
    <PortalLayout title="إدارة أوامر العمل" items={sidebarItems}>
      <div className="p-8 text-center border-2 border-dashed border-border rounded-3xl bg-white">
        <ClipboardList className="h-16 w-16 mx-auto text-primary/20 mb-4" />
        <h2 className="text-2xl font-bold text-primary-deep">أوامر العمل</h2>
        <p className="text-muted-foreground mt-2">هذه الصفحة قيد التطوير حالياً لعرض وتصفية كافة أوامر العمل.</p>
      </div>
    </PortalLayout>
  ),
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];
