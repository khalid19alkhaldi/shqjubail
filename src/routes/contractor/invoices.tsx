import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, CheckSquare, FileText, Download, Wallet, CreditCard, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CONTRACTOR_INVOICES } from "@/lib/mock-data";
import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

export const Route = createFileRoute("/contractor/invoices")({
  beforeLoad: () => {
    const savedUser = localStorage.getItem("shq_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (!user || user.role !== "contractor") {
      throw redirect({ to: "/contractor/login" });
    }
  },
  component: ContractorInvoices,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/contractor" },
  { title: "الأوامر المسندة", icon: ClipboardList, href: "/contractor/assigned" },
  { title: "إنجازات سابقة", icon: CheckSquare, href: "/contractor/history" },
  { title: "الفواتير", icon: FileText, href: "/contractor/invoices" },
];

function ContractorInvoices() {
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);

  return (
    <PortalLayout title="الفواتير والمدفوعات" items={sidebarItems}>
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="border-none shadow-card-soft bg-primary-deep text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm opacity-80">إجمالي المستحقات</div>
                  <div className="text-3xl font-black mt-2">18,500 ر.س</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex justify-between items-start text-primary-deep">
                <div>
                  <div className="text-sm text-muted-foreground">تم صرفها</div>
                  <div className="text-3xl font-black mt-2">12,400 ر.س</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex justify-between items-start text-primary-deep">
                <div>
                  <div className="text-sm text-muted-foreground">قيد المعالجة</div>
                  <div className="text-3xl font-black mt-2">6,100 ر.س</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep">كشف الفواتير</h2>
          <Button variant="outline" className="rounded-xl gap-2" onClick={() => toast.info("جاري تجهيز ملف PDF للتحميل...")}>
            <Download className="h-4 w-4" />
            تحميل الكشف
          </Button>
        </div>

        <Card className="border-none shadow-card-soft overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="text-right">رقم الفاتورة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CONTRACTOR_INVOICES.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-bold">{inv.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                    <TableCell className="font-bold text-primary-deep">{inv.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${inv.status === "مدفوعة" ? "border-green-200 bg-green-50 text-green-700" :
                          inv.status === "بانتظار الاعتماد" ? "border-blue-200 bg-blue-50 text-blue-700" :
                          "border-amber-200 bg-amber-50 text-amber-700"}
                      `}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary font-bold gap-1"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <Eye className="h-4 w-4" />
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-bold text-primary-deep">فاتورة {selectedInvoice?.id}</DialogTitle>
            <DialogDescription className="text-right">تفاصيل بنود الفاتورة والمستحقات.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">أجور اليد العاملة:</span>
                <span className="font-bold">2,400 ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">قطع غيار:</span>
                <span className="font-bold">1,100 ر.س</span>
              </div>
              <div className="flex justify-between text-sm border-t border-white/50 pt-2">
                <span className="text-primary-deep font-bold">الإجمالي:</span>
                <span className="text-primary-deep font-black">{selectedInvoice?.amount}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 rounded-xl font-bold" onClick={() => toast.info("تحميل الفاتورة PDF")}>تحميل</Button>
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelectedInvoice(null)}>إغلاق</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
