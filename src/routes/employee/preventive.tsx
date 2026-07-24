import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PREVENTIVE_TASKS } from "@/lib/mock-data";

export const Route = createFileRoute("/employee/preventive")({
  beforeLoad: () => {
    const savedUser = localStorage.getItem("shq_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (!user || user.role !== "employee") {
      throw redirect({ to: "/employee/login" });
    }
  },
  component: EmployeePreventive,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];

function EmployeePreventive() {
  return (
    <PortalLayout title="الصيانة الوقائية" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep">جدول الصيانة الدورية</h2>
          <Button className="rounded-xl gap-2">
            <Calendar className="h-4 w-4" />
            جدولة مهمة جديدة
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PREVENTIVE_TASKS.map((task) => (
            <Card key={task.id} className="border-none shadow-card-soft hover:shadow-elegant transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
                <Wrench className="h-5 w-5 text-primary/40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">التكرار:</span>
                    <span className="font-semibold">{task.frequency}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">التاريخ القادم:</span>
                    <span className={`font-bold ${task.status === "عاجل" ? "text-red-600" : "text-primary-deep"}`}>
                      {task.nextDate}
                    </span>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-dashed">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      task.status === "عاجل" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                      {task.status}
                    </span>
                    <Button variant="ghost" size="sm" className="text-primary gap-1 font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      تعميد الآن
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
