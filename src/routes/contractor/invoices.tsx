import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, CheckSquare, FileText } from "lucide-react";

export const Route = createFileRoute("/contractor/invoices")({
  beforeLoad: () => {
    const savedUser = localStorage.getItem("shq_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (!user || user.role !== "contractor") {
      throw redirect({ to: "/contractor/login" });
    }
  },
  component: () => (
    <PortalLayout title="الفواتير والمدفوعات" items={sidebarItems}>
      <div className="p-8 text-center border-2 border-dashed border-border rounded-3xl bg-white">
        <FileText className="h-16 w-16 mx-auto text-primary/20 mb-4" />
        <h2 className="text-2xl font-bold text-primary-deep">الفواتير</h2>
        <p className="text-muted-foreground mt-2">هذه الصفحة قيد التطوير حالياً لمتابعة حالة الفواتير والمستحقات المالية.</p>
      </div>
    </PortalLayout>
  ),
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/contractor" },
  { title: "الأوامر المسندة", icon: ClipboardList, href: "/contractor/assigned" },
  { title: "إنجازات سابقة", icon: CheckSquare, href: "/contractor/history" },
  { title: "الفواتير", icon: FileText, href: "/contractor/invoices" },
];
