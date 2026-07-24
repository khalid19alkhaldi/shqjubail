import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Building2,
  BarChart3,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/employee/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/employee/login",
      });
    }
    if (context.auth.user?.role !== "employee") {
      throw redirect({
        to: "/",
      });
    }
  },
  component: EmployeeDashboard,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];

const stats = [
  { title: "أوامر نشطة", value: "24", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "بانتظار الاعتماد", value: "12", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
  { title: "مكتمل اليوم", value: "8", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  { title: "إجمالي المباني", value: "45", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
];

const recentOrders = [
  { id: "WO-5521", title: "صيانة مكيفات — مدرسة الفرقان", date: "منذ ساعتين", status: "نشط", priority: "عالية" },
  { id: "WO-5519", title: "إصلاح تسرب مياه — مسجد الفاروق", date: "منذ 4 ساعات", status: "قيد التنفيذ", priority: "متوسطة" },
  { id: "WO-5518", title: "فحص مصعد — مبنى الإدارة", date: "أمس", status: "مكتمل", priority: "عالية" },
];

function EmployeeDashboard() {
  return (
    <PortalLayout
      title="لوحة تحكم الموظفين"
      items={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-deep">مرحباً أحمد</h2>
            <p className="text-muted-foreground">إليك نظرة سريعة على حالة الصيانة اليوم.</p>
          </div>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            أمر عمل جديد
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.title} className="border-none shadow-card-soft overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{s.title}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-none shadow-card-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">أحدث أوامر العمل</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary font-bold">عرض الكل</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/20 transition">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center`}>
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{order.title}</div>
                        <div className="text-xs text-muted-foreground">{order.id} • {order.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        order.priority === "عالية" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {order.priority}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity/Alerts */}
          <Card className="border-none shadow-card-soft">
            <CardHeader>
              <CardTitle className="text-lg">تنبيهات هامة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-red-900">تأخر في التنفيذ</div>
                      <p className="text-xs text-red-700 mt-1">أمر عمل WO-5400 تجاوز الزمن المحدد بـ 4 ساعات.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex gap-3">
                    <Wrench className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-amber-900">صيانة دورية غداً</div>
                      <p className="text-xs text-amber-700 mt-1">يوجد 5 مهام صيانة وقائية للمكيفات مجدولة غداً.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
