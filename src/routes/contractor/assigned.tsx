import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, CheckSquare, FileText, MapPin, Calendar, Clock, Camera, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/contractor/assigned")({
  beforeLoad: () => {
    const savedUser = localStorage.getItem("shq_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (!user || user.role !== "contractor") {
      throw redirect({ to: "/contractor/login" });
    }
  },
  component: ContractorAssigned,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/contractor" },
  { title: "الأوامر المسندة", icon: ClipboardList, href: "/contractor/assigned" },
  { title: "إنجازات سابقة", icon: CheckSquare, href: "/contractor/history" },
  { title: "الفواتير", icon: FileText, href: "/contractor/invoices" },
];

function ContractorAssigned() {
  const handleAction = (action: string) => {
    toast.info(`قريباً: تفعيل خاصية ${action}`);
  };

  return (
    <PortalLayout title="الأوامر المسندة" items={sidebarItems}>
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-deep">أوامر العمل النشطة</h2>

        <div className="space-y-4">
          {MOCK_ORDERS.filter(o => o.status !== "مكتمل").map((order) => (
            <Card key={order.id} className="border-none shadow-card-soft hover:border-gold/30 border transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{order.id}</Badge>
                      <Badge variant="outline" className={order.priority === "عالية" ? "text-red-600 border-red-200" : ""}>
                        {order.priority}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-primary-deep">{order.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {order.building}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        تاريخ الإسناد: {order.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap lg:flex-col justify-end gap-3 min-w-[180px]">
                    <Button variant="outline" className="gap-2 rounded-xl flex-1" onClick={() => handleAction("رفع الصور")}>
                      <Camera className="h-4 w-4" />
                      رفع صور الإنجاز
                    </Button>
                    <Button className="gap-2 rounded-xl flex-1 bg-primary hover:bg-primary-deep" onClick={() => handleAction("إنهاء التذكرة")}>
                      <CheckCircle2 className="h-4 w-4" />
                      تأكيد الإنجاز
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-medium">الحالة: {order.status}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    يجب الإنجاز خلال 24 ساعة
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
