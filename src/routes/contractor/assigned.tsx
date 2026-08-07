import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, CheckSquare, FileText, MapPin, Calendar, Clock, Camera, CheckCircle2, XCircle, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import React from "react";
import { ContractorQuoteModal } from "@/components/ContractorQuoteModal";
import { SignatureModal } from "@/components/SignatureModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getOrders, updateOrderStatus } from "@/lib/data-service";

export const Route = createFileRoute("/contractor/assigned")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "contractor") {
        throw redirect({ to: "/contractor/login" });
      }
    }
  },
  component: ContractorAssigned,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/contractor" },
  { title: "الأوامر المسندة", icon: ClipboardList, href: "/contractor/assigned" },
  { title: "إنجازات سابقة", icon: CheckSquare, href: "/contractor/history" },
];

function ContractorAssigned() {
  const [selectedOrder, setSelectedOrder] = React.useState<{id: string, title: string} | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [isUploadModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = React.useState(false);
  const [orders, setOrders] = React.useState<any[]>([]);

  const refreshOrders = async () => {
    setOrders(await getOrders());
  };

  React.useEffect(() => {
    refreshOrders();
  }, []);

  const handleConfirmCompletion = (orderId: string, title: string) => {
    setSelectedOrder({ id: orderId, title });
    setIsSignatureModalOpen(true);
  };

  const onSignatureConfirm = (signature: string) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, "مكتمل", { signature });
      toast.success("تم تأكيد الإنجاز وتوثيق التوقيع بنجاح");
      refreshOrders();
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, "مرفوض من المقاول");
      setIsRejectModalOpen(false);
      toast.error("تم رفض العمل وإبلاغ الجمعية");
      refreshOrders();
    }
  };

  const handleQuoteClick = (id: string, title: string) => {
    setSelectedOrder({ id, title });
    setIsQuoteModalOpen(true);
  };

  const handleRejectClick = (id: string, title: string) => {
    setSelectedOrder({ id, title });
    setIsRejectModalOpen(true);
  };

  return (
    <PortalLayout title="الأوامر المسندة" items={sidebarItems}>
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-deep">أوامر العمل النشطة</h2>

        <div className="space-y-4">
          {orders.filter((o: any) => o.status !== "مكتمل" && o.status !== "مرفوض من المقاول").map((order: any) => (
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
                    {order.status === "بانتظار قبول المقاول" ? (
                      <>
                        <Button className="gap-2 rounded-xl flex-1 bg-primary hover:bg-primary-deep" onClick={() => handleQuoteClick(order.id, order.title)}>
                          <CheckCircle2 className="h-4 w-4" />
                          قبول وتقديم عرض مالي
                        </Button>
                        <Button variant="outline" className="gap-2 rounded-xl flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleRejectClick(order.id, order.title)}>
                          <XCircle className="h-4 w-4" />
                          رفض العمل
                        </Button>
                      </>
                    ) : order.status === "تم تقديم خطة تنفيذ" ? (
                      <div className="text-center p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-xs font-bold text-blue-700">تم تقديم العرض</p>
                        <p className="text-[10px] text-blue-600 mt-1">بانتظار موافقة الجمعية</p>
                      </div>
                    ) : (
                      <>
                        <Button variant="outline" className="gap-2 rounded-xl flex-1" onClick={() => setIsAddModalOpen(true)}>
                          <Camera className="h-4 w-4" />
                          رفع صور الإنجاز
                        </Button>
                        <Button className="gap-2 rounded-xl flex-1 bg-primary hover:bg-primary-deep" onClick={() => handleConfirmCompletion(order.id, order.title)}>
                          <CheckCircle2 className="h-4 w-4" />
                          تأكيد الإنجاز
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${order.status === "بانتظار قبول المقاول" ? "bg-amber-500 animate-pulse" : "bg-primary"}`} />
                    <span className="font-medium">الحالة: {order.status}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {order.status === "بانتظار قبول المقاول" ? "يُرجى الرد على الطلب" : "يجب الإنجاز خلال 24 ساعة"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {orders.filter((o: any) => o.status !== "مكتمل" && o.status !== "مرفوض من المقاول").length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-border">
              <p className="text-muted-foreground">لا يوجد أوامر مسندة حالياً.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quote Modal */}
      {selectedOrder && (
        <ContractorQuoteModal
          isOpen={isQuoteModalOpen}
          onOpenChange={setIsQuoteModalOpen}
          orderId={selectedOrder.id}
          orderTitle={selectedOrder.title}
        />
      )}

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-red-600 font-bold">رفض أمر العمل</DialogTitle>
            <DialogDescription className="text-right">يرجى ذكر سبب الرفض لإبلاغ إدارة الجمعية.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRejectSubmit} className="space-y-4 py-2 text-right">
            <div className="space-y-2">
              <Label className="font-bold">سبب الرفض</Label>
              <Textarea placeholder="مثلاً: انشغال الطاقم الفني حالياً..." required className="rounded-xl" />
            </div>
            <DialogFooter>
              <Button type="submit" variant="destructive" className="w-full rounded-xl font-bold">تأكيد الرفض</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Modal Simulation */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-bold">رفع صور الإنجاز</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-secondary/10 flex flex-col items-center justify-center cursor-pointer">
                <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-[10px]">صورة قبل</span>
              </div>
              <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-secondary/10 flex flex-col items-center justify-center cursor-pointer">
                <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-[10px]">صورة بعد</span>
              </div>
            </div>
            <Button className="w-full rounded-xl font-bold" onClick={() => {
              setIsAddModalOpen(false);
              toast.success("تم رفع الصور بنجاح");
            }}>حفظ وإرسال</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signature Modal */}
      {selectedOrder && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onOpenChange={setIsSignatureModalOpen}
          onConfirm={onSignatureConfirm}
          title={selectedOrder.title}
        />
      )}
    </PortalLayout>
  );
}
