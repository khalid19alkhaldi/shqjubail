import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  FileText,
  Clock,
  CheckCircle2,
  HardHat,
  Camera
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React from "react";
import { getOrders, getDashboardStats } from "@/lib/data-service";

export const Route = createFileRoute("/contractor/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;

      if (!user) {
        throw redirect({
          to: "/contractor/login",
        });
      }

      if (user.role !== "contractor") {
        throw redirect({
          to: "/",
        });
      }
    }
  },
  component: ContractorDashboard,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/contractor" },
  { title: "الأوامر المسندة", icon: ClipboardList, href: "/contractor/assigned" },
  { title: "إنجازات سابقة", icon: CheckSquare, href: "/contractor/history" },
];

function ContractorDashboard() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [statsData, setStatsData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders.filter((o: any) => o.status !== "مكتمل").slice(0, 2));

      const stats = await getDashboardStats();
      setStatsData(stats);
    };
    fetchData();
  }, []);

  const handleAction = (action: string) => {
    toast.info(`قريباً: تفعيل خاصية ${action}`);
  };

  const displayStats = statsData ? [
    { title: "أوامر بانتظار البدء", value: orders.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "قيد التنفيذ", value: statsData.active - orders.length, icon: HardHat, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "تم تسليمه اليوم", value: statsData.completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { title: "التقييم العام", value: "4.8", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
  ] : [];

  return (
    <PortalLayout
      title="لوحة تحكم المقاول"
      items={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-deep">مرحباً مؤسسة صيانة الشرق</h2>
            <p className="text-muted-foreground">لديك {orders.length} أوامر عمل بانتظار البدء اليوم.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((s) => (
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
          {/* Assigned Orders List */}
          <Card className="lg:col-span-2 border-none shadow-card-soft">
            <CardHeader>
              <CardTitle className="text-lg">الأوامر المسندة إليكم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg mb-2 inline-block">{order.id}</span>
                        <h3 className="font-bold text-lg">{order.task || order.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <span className="font-medium">{order.location || order.building}</span>
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        order.priority === "عالية" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {order.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-dashed">
                      <div className="text-xs text-muted-foreground">
                        موعد التسليم: <span className="font-bold text-foreground">{order.deadline || "اليوم"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => handleAction("رفع الصور")}>
                          <Camera className="h-4 w-4" />
                          رفع صورة
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary-deep" onClick={() => handleAction("بدء العمل")}>
                          بدء العمل
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center py-10 text-muted-foreground">لا يوجد أوامر عمل بانتظار البدء.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Guidelines / Announcements */}
          <Card className="border-none shadow-card-soft">
            <CardHeader>
              <CardTitle className="text-lg">تعليمات هامة</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-gold mt-2 shrink-0" />
                  <p className="text-sm text-muted-foreground">يجب رفع صورة "قبل العمل" وصورة "بعد الإنجاز" لكل تذكرة.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-gold mt-2 shrink-0" />
                  <p className="text-sm text-muted-foreground">يرجى التأكد من توقيع الموظف المسؤول في الموقع بعد الانتهاء.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-gold mt-2 shrink-0" />
                  <p className="text-sm text-muted-foreground">سيتم صرف الفواتير المعتمدة خلال 15 يوم عمل من تاريخ الاعتماد.</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
