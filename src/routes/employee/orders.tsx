import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Building2,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { NewWorkOrderModal } from "@/components/NewWorkOrderModal";
import React from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

import { getOrders } from "@/lib/data-service";

export const Route = createFileRoute("/employee/orders")({
  beforeLoad: () => {
    const savedUser = localStorage.getItem("shq_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (!user || user.role !== "employee") {
      throw redirect({ to: "/employee/login" });
    }
  },
  component: EmployeeOrders,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];

function EmployeeOrders() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleQuoteAction = (action: string, orderId: string) => {
    toast.success(`تم ${action} العرض المالي للطلب ${orderId} بنجاح`);
  };

  return (
    <PortalLayout title="إدارة أوامر العمل" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="بحث برقم الأمر أو العنوان..." className="pr-10 rounded-xl" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Filter className="h-4 w-4" />
              تصفية
            </Button>
            <Button className="gap-2 rounded-xl" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              أمر عمل جديد
            </Button>
          </div>
        </div>

        <NewWorkOrderModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

        <Card className="border-none shadow-card-soft overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="text-right">رقم الأمر</TableHead>
                  <TableHead className="text-right">عنوان الطلب</TableHead>
                  <TableHead className="text-right">المبنى</TableHead>
                  <TableHead className="text-right">الأولوية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="font-bold">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.title}</div>
                      <div className="text-xs text-muted-foreground">{order.category}</div>
                    </TableCell>
                    <TableCell>{order.building}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${order.priority === "عالية" ? "border-red-200 bg-red-50 text-red-700" :
                          order.priority === "متوسطة" ? "border-amber-200 bg-amber-50 text-amber-700" :
                          "border-blue-200 bg-blue-50 text-blue-700"}
                      `}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${
                            order.status === "مكتمل" ? "bg-green-500" :
                            order.status === "متأخر" ? "bg-red-500" :
                            order.status === "تم تقديم عرض مالي" ? "bg-blue-500" : "bg-amber-500"
                          }`} />
                          <span className="text-sm font-medium">{order.status}</span>
                        </div>
                        {(order as any).quote && (
                          <div className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                            العرض: {(order as any).quote}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {order.status === "تم تقديم عرض مالي" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 gap-1"
                              onClick={() => handleQuoteAction("اعتماد", order.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              اعتماد
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 gap-1"
                              onClick={() => handleQuoteAction("رفض", order.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              رفض
                            </Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
