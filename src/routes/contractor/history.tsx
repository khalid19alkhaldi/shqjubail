import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, CheckSquare, FileText, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/lib/mock-data";

export const Route = createFileRoute("/contractor/history")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "contractor") {
        throw redirect({ to: "/contractor/login" });
      }
    }
  },
  component: ContractorHistory,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/contractor" },
  { title: "الأوامر المسندة", icon: ClipboardList, href: "/contractor/assigned" },
  { title: "إنجازات سابقة", icon: CheckSquare, href: "/contractor/history" },
  { title: "الفواتير", icon: FileText, href: "/contractor/invoices" },
];

function ContractorHistory() {
  const completedOrders = MOCK_ORDERS.filter(o => o.status === "مكتمل");

  return (
    <PortalLayout title="تاريخ الإنجازات" items={sidebarItems}>
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-deep">الأعمال المكتملة</h2>

        <div className="grid gap-4">
          {completedOrders.map((order) => (
            <Card key={order.id} className="border-none shadow-card-soft">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                      <CheckSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.title}</h3>
                      <p className="text-sm text-muted-foreground">{order.building} • {order.id}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs font-bold mr-1 text-muted-foreground">(5.0)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3 w-3" />
                      تم الإنجاز في: {order.date}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {completedOrders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-border">
              <p className="text-muted-foreground">لا يوجد أعمال مكتملة حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
