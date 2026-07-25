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
  Plus,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  MapPin,
  Calendar,
  Map as MapIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NewWorkOrderModal } from "@/components/NewWorkOrderModal";
import React from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getOrders, updateOrderStatus, deleteOrder } from "@/lib/data-service";

export const Route = createFileRoute("/employee/orders")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeeOrders,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "خريطة المرافق", icon: MapIcon, href: "/employee/map" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];

function EmployeeOrders() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterPriority, setFilterPriority] = React.useState<string>("all");

  const refreshOrders = () => {
    let allOrders = getOrders();

    if (searchQuery) {
      allOrders = allOrders.filter((o: any) =>
        (o.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (o.id?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (o.building?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      );
    }

    if (filterPriority !== "all") {
      allOrders = allOrders.filter((o: any) => o.priority === filterPriority);
    }

    setOrders(allOrders);
  };

  React.useEffect(() => {
    refreshOrders();
  }, [searchQuery, filterPriority]);

  const handleQuoteAction = (action: string, orderId: string) => {
    const newStatus = action === "اعتماد" ? "قيد التنفيذ" : "مرفوض";
    updateOrderStatus(orderId, newStatus);
    toast.success(`تم ${action} العرض المالي للطلب ${orderId} بنجاح`);
    refreshOrders();
  };

  const handleDelete = (orderId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      deleteOrder(orderId);
      toast.success("تم حذف الطلب بنجاح");
      refreshOrders();
    }
  };

  return (
    <PortalLayout title="إدارة أوامر العمل" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث برقم الأمر، العنوان، أو المبنى..."
              className="pr-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Filter className="h-4 w-4" />
                  الأولوية: {filterPriority === "all" ? "الكل" : filterPriority}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" dir="rtl">
                <DropdownMenuItem onClick={() => setFilterPriority("all")}>الكل</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority("عالية")}>عالية</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority("متوسطة")}>متوسطة</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority("منخفضة")}>منخفضة</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                        {order.quote && (
                          <div className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                            العرض: {order.quote}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" dir="rtl">
                              <DropdownMenuLabel className="text-right">الإجراءات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-right gap-2 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" /> عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-right gap-2 cursor-pointer" onClick={() => toast.info("قريباً: تعديل بيانات الطلب")}>
                                <Edit className="h-4 w-4" /> تعديل الطلب
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-right gap-2 cursor-pointer" onClick={() => toast.info("جاري تجهيز نسخة للطباعة...")}>
                                <FileText className="h-4 w-4" /> طباعة أمر العمل
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-right gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(order.id)}
                              >
                                <Trash2 className="h-4 w-4" /> حذف الطلب
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      لا توجد أوامر عمل تطابق بحثك.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-bold text-primary-deep flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              تفاصيل أمر العمل {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4 text-right">
            <div className="space-y-1">
              <h4 className="font-bold text-lg">{selectedOrder?.title}</h4>
              <p className="text-sm text-muted-foreground">{selectedOrder?.category}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-secondary/30 space-y-1">
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> الموقع
                </div>
                <div className="text-sm font-bold">{selectedOrder?.building}</div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30 space-y-1">
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> التاريخ
                </div>
                <div className="text-sm font-bold">{selectedOrder?.date}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">وصف البلاغ</Label>
              <div className="p-4 rounded-xl border border-border text-sm leading-relaxed bg-white">
                {selectedOrder?.desc || "يوجد تسرب مياه في المنطقة المذكورة يتطلب فحصاً فورياً."}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-primary-deep text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-gold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] opacity-70">المقاول المسند</div>
                  <div className="text-sm font-bold">{selectedOrder?.contractor || "غير مسند حالياً"}</div>
                </div>
              </div>
              <Badge className="bg-gold text-gold-foreground font-bold">{selectedOrder?.status}</Badge>
            </div>

            {selectedOrder?.signature && (
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  توقيع استلام العمل
                </Label>
                <div className="p-2 rounded-xl border border-border bg-secondary/10">
                  <img
                    src={selectedOrder.signature}
                    alt="التوقيع"
                    className="w-full h-32 object-contain"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => setSelectedOrder(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
