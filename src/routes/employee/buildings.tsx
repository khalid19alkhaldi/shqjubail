import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3, MapPin, Package, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_BUILDINGS } from "@/lib/mock-data";

export const Route = createFileRoute("/employee/buildings")({
  beforeLoad: () => {
    const savedUser = localStorage.getItem("shq_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (!user || user.role !== "employee") {
      throw redirect({ to: "/employee/login" });
    }
  },
  component: EmployeeBuildings,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];

function EmployeeBuildings() {
  return (
    <PortalLayout title="إدارة المباني والأصول" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep">سجل المرافق</h2>
          <Button className="rounded-xl gap-2">
            <Building2 className="h-4 w-4" />
            إضافة مرفق جديد
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_BUILDINGS.map((building) => (
            <Card key={building.id} className="overflow-hidden border-none shadow-card-soft hover:shadow-elegant transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img src={building.image} alt={building.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <Badge className="absolute top-4 right-4 bg-primary/90">{building.type}</Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-primary-deep flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {building.name}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-dashed pt-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" /> عدد الأصول
                    </div>
                    <div className="text-sm font-bold">{building.assets} أصل</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> أوامر نشطة
                    </div>
                    <div className="text-sm font-bold text-amber-600">{building.activeOrders} بلاغ</div>
                  </div>
                </div>
                <Button variant="secondary" className="w-full mt-5 rounded-xl font-bold">عرض التفاصيل</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
