import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3, MapPin, Package, AlertCircle, Plus, Camera, Map as MapIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getBuildings, addBuilding } from "@/lib/data-service";
import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/employee/buildings")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeeBuildings,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "خريطة المرافق", icon: MapIcon, href: "/employee/map" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];

function EmployeeBuildings() {
  const [buildings, setBuildings] = React.useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = React.useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    type: "تعليمي",
    splitAC: "0",
    concealedAC: "0",
    fireSystem: "نشط",
    otherContents: ""
  });

  const refreshBuildings = async () => {
    const data = await getBuildings();
    setBuildings(data);
  };

  React.useEffect(() => {
    refreshBuildings();
  }, []);

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newBuilding = {
      id: `B${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      type: formData.type,
      assets: parseInt(formData.splitAC) + parseInt(formData.concealedAC),
      active_orders: 0,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
      lat: 27.01 + Math.random() * 0.02,
      lng: 49.65 + Math.random() * 0.02,
      details: {
        splitAC: parseInt(formData.splitAC),
        concealedAC: parseInt(formData.concealedAC),
        fireSystem: formData.fireSystem,
        otherContents: formData.otherContents
      }
    };

    try {
      await addBuilding(newBuilding);
      setLoading(false);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        type: "تعليمي",
        splitAC: "0",
        concealedAC: "0",
        fireSystem: "نشط",
        otherContents: ""
      });
      toast.success("تمت إضافة المرفق الجديد بنجاح");
      refreshBuildings();
    } catch (error) {
      setLoading(false);
      toast.error("خطأ في إضافة المرفق");
    }
  };

  return (
    <PortalLayout title="إدارة المباني والأصول" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep">سجل المرافق</h2>
          <Button className="rounded-xl gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            إضافة مرفق جديد
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => (
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
                <Button
                  variant="secondary"
                  className="w-full mt-5 rounded-xl font-bold"
                  onClick={() => setSelectedBuilding(building)}
                >
                  عرض التفاصيل والأصول
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedBuilding} onOpenChange={(open) => !open && setSelectedBuilding(null)}>
        <DialogContent className="sm:max-w-[450px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-bold text-primary-deep flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              تفاصيل {selectedBuilding?.name}
            </DialogTitle>
            <DialogDescription className="text-right">
              قائمة الأصول والملحقات المسجلة في هذا المرفق.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">نوع المبنى:</span>
                <span className="font-bold">{selectedBuilding?.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">مكيفات سبيلت:</span>
                <span className="font-bold">{selectedBuilding?.details?.splitAC || 0} وحدة</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">مكيفات كونسيلد:</span>
                <span className="font-bold">{selectedBuilding?.details?.concealedAC || 0} وحدات</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">أنظمة إطفاء:</span>
                <span className="font-bold">{selectedBuilding?.details?.fireSystem || "غير محدد"}</span>
              </div>
              {selectedBuilding?.details?.otherContents && (
                <div className="pt-2 border-t border-white/20">
                  <div className="text-[10px] text-muted-foreground mb-1">مرفقات أخرى (داخلية/خارجية):</div>
                  <div className="text-sm font-medium">{selectedBuilding.details.otherContents}</div>
                </div>
              )}
            </div>
            <Button className="w-full rounded-xl font-bold" onClick={() => toast.info("تحميل سجل الأصول PDF")}>
              تحميل سجل الأصول
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Building Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-bold text-primary-deep">إضافة مرفق جديد</DialogTitle>
            <DialogDescription className="text-right">أدخل بيانات المرفق وتفاصيل الأصول الموجودة به.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBuilding} className="space-y-4 py-4 text-right">
            <div className="space-y-2">
              <Label className="font-bold">اسم المرفق</Label>
              <Input
                placeholder="مثلاً: مدرسة تحفيظ جديدة"
                required
                className="rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">نوع المرفق</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger className="rounded-xl text-right">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تعليمي">تعليمي</SelectItem>
                    <SelectItem value="ديني">ديني (مسجد)</SelectItem>
                    <SelectItem value="إداري">إداري</SelectItem>
                    <SelectItem value="استثماري">استثماري (أوقاف)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">نظام الحريق</Label>
                <Select value={formData.fireSystem} onValueChange={(v) => setFormData({...formData, fireSystem: v})}>
                  <SelectTrigger className="rounded-xl text-right">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="تحت الصيانة">تحت الصيانة</SelectItem>
                    <SelectItem value="غير متوفر">غير متوفر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-xs">عدد مكيفات سبليت</Label>
                <Input
                  type="number"
                  className="rounded-xl"
                  value={formData.splitAC}
                  onChange={(e) => setFormData({...formData, splitAC: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs">عدد مكيفات كونسيلد</Label>
                <Input
                  type="number"
                  className="rounded-xl"
                  value={formData.concealedAC}
                  onChange={(e) => setFormData({...formData, concealedAC: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">محتويات أخرى (داخلية وخارجية)</Label>
              <Textarea
                placeholder="مثلاً: مظلات خارجية، خزانات مياه سعة 5000 لتر، نظام ري آلي..."
                className="rounded-xl min-h-[80px]"
                value={formData.otherContents}
                onChange={(e) => setFormData({...formData, otherContents: e.target.value})}
              />
            </div>

            <div className="p-6 border-2 border-dashed border-border rounded-2xl text-center bg-secondary/10 cursor-pointer hover:bg-secondary/20 transition-colors">
              <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
              <div className="text-[10px] text-muted-foreground">رفع صورة المرفق</div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full rounded-xl font-bold bg-primary h-12" disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ المرفق وبيانات الأصول"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
