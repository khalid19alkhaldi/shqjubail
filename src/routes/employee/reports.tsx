import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { employeeSidebarItems } from "@/lib/employee-nav";
import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3, Download, TrendingUp, Map as MapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export const Route = createFileRoute("/employee/reports")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeeReports,
});

const sidebarItems = employeeSidebarItems;

const chartData = [
  { name: "يناير", value: 400 },
  { name: "فبراير", value: 300 },
  { name: "مارس", value: 600 },
  { name: "أبريل", value: 800 },
  { name: "مايو", value: 500 },
  { name: "يونيو", value: 900 },
];

function EmployeeReports() {
  return (
    <PortalLayout title="التقارير والتحليلات" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep">مؤشرات الأداء (KPIs)</h2>
          <Button variant="outline" className="rounded-xl gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bar Chart */}
          <Card className="border-none shadow-card-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                أوامر العمل المنجزة شهرياً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" fill="#15362b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="border-none shadow-card-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold" />
                متوسط زمن الاستجابة (بالدقائق)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#cfa968" strokeWidth={3} dot={{ r: 4, fill: '#cfa968' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-none shadow-card-soft bg-primary-deep text-white">
            <CardContent className="p-6">
              <div className="text-sm opacity-80">إجمالي التكاليف</div>
              <div className="text-3xl font-black mt-2">12,450 ر.س</div>
              <div className="text-xs mt-2 text-gold font-bold">+12% عن الشهر الماضي</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft bg-gold text-gold-foreground">
            <CardContent className="p-6">
              <div className="text-sm opacity-80">نسبة رضا المستخدمين</div>
              <div className="text-3xl font-black mt-2">%94</div>
              <div className="text-xs mt-2 font-bold">بناءً على 240 تقييم</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">أكثر المقاولين إنجازاً</div>
              <div className="text-xl font-bold mt-2 text-primary-deep">مؤسسة صيانة الشرق</div>
              <div className="text-xs mt-2 text-muted-foreground">45 تذكرة مكتملة</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
