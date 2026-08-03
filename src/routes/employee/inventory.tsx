import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { employeeSidebarItems } from "@/lib/employee-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Boxes, Plus, Minus, AlertTriangle, PackageSearch, Download } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/employee/inventory")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeeInventory,
});

type Part = { id: string; name: string; category: string; qty: number; min: number; unit: string; location: string };

const DEFAULT_PARTS: Part[] = [
  { id: "SP-01", name: "فلتر مكيف سبليت", category: "تكييف", qty: 24, min: 10, unit: "قطعة", location: "مستودع الإدارة" },
  { id: "SP-02", name: "غاز تبريد R410", category: "تكييف", qty: 3, min: 5, unit: "أسطوانة", location: "مستودع الإدارة" },
  { id: "SP-03", name: "لمبة LED 18 واط", category: "كهرباء", qty: 120, min: 40, unit: "قطعة", location: "مستودع الفرقان" },
  { id: "SP-04", name: "قاطع كهربائي 32A", category: "كهرباء", qty: 8, min: 6, unit: "قطعة", location: "مستودع الإدارة" },
  { id: "SP-05", name: "صنبور وضوء", category: "سباكة", qty: 4, min: 8, unit: "قطعة", location: "مستودع الفاروق" },
  { id: "SP-06", name: "طفاية حريق 6 كجم", category: "سلامة", qty: 15, min: 10, unit: "طفاية", location: "مستودع الإدارة" },
];

const STORAGE_KEY = "shq_inventory";

function EmployeeInventory() {
  const [parts, setParts] = React.useState<Part[]>(DEFAULT_PARTS);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", category: "تكييف", qty: "", min: "", unit: "قطعة", location: "مستودع الإدارة" });

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setParts(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (next: Part[]) => {
    setParts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const changeQty = (id: string, delta: number) => {
    persist(parts.map(p => p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(form.qty);
    const min = Number(form.min);
    if (!form.name.trim()) return toast.error("اسم القطعة مطلوب");
    if (!Number.isFinite(qty) || qty < 0) return toast.error("الكمية غير صحيحة");
    if (!Number.isFinite(min) || min < 0) return toast.error("حد التنبيه غير صحيح");

    persist([{ id: `SP-${Math.floor(Math.random() * 900 + 100)}`, name: form.name.trim(), category: form.category, qty, min, unit: form.unit, location: form.location }, ...parts]);
    setForm({ name: "", category: "تكييف", qty: "", min: "", unit: "قطعة", location: "مستودع الإدارة" });
    setOpen(false);
    toast.success("تمت إضافة القطعة إلى المستودع");
  };

  const exportCsv = () => {
    const rows = [["الرمز", "الصنف", "التصنيف", "الكمية", "حد التنبيه", "الوحدة", "الموقع"],
      ...parts.map(p => [p.id, p.name, p.category, String(p.qty), String(p.min), p.unit, p.location])];
    const csv = "\uFEFF" + rows.map(r => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.download = "spare-parts.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير جرد المستودع");
  };

  const filtered = parts.filter(p => (p.name + p.category + p.location + p.id).includes(query.trim()));
  const low = parts.filter(p => p.qty <= p.min);

  return (
    <PortalLayout title="مستودع قطع الغيار" items={employeeSidebarItems}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary-deep">جرد قطع الغيار</h2>
            <p className="text-sm text-muted-foreground">تابع المخزون وتنبيهات النواقص قبل توقف الصيانة</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl gap-2" onClick={exportCsv}>
              <Download className="h-4 w-4" /> تصدير
            </Button>
            <Button className="rounded-xl gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> إضافة صنف
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center"><Boxes className="h-5 w-5 text-primary" /></div>
              <div><div className="text-2xl font-black text-primary-deep">{parts.length}</div><div className="text-xs text-muted-foreground">إجمالي الأصناف</div></div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
              <div><div className="text-2xl font-black text-amber-600">{low.length}</div><div className="text-xs text-muted-foreground">أصناف تحت حد التنبيه</div></div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center"><PackageSearch className="h-5 w-5 text-primary" /></div>
              <div><div className="text-2xl font-black text-primary-deep">{parts.reduce((s, p) => s + p.qty, 0)}</div><div className="text-xs text-muted-foreground">إجمالي القطع</div></div>
            </CardContent>
          </Card>
        </div>

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث باسم الصنف أو التصنيف أو المستودع..."
          className="rounded-xl max-w-md"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="border-none shadow-card-soft">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-primary-deep">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.id} — {p.location}</div>
                  </div>
                  <Badge variant="outline" className="rounded-lg border-primary/20 text-primary-deep">{p.category}</Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" onClick={() => changeQty(p.id, -1)} aria-label="إنقاص">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-black text-lg min-w-10 text-center">{p.qty}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" onClick={() => changeQty(p.id, 1)} aria-label="زيادة">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">{p.unit}</span>
                  </div>
                  {p.qty <= p.min ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">يحتاج توريد</span>
                  ) : (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">متوفر</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[460px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-bold text-primary-deep">إضافة صنف للمستودع</DialogTitle>
            <DialogDescription className="text-right">سجّل قطعة الغيار وحدد حد التنبيه لإعادة الطلب.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 text-right">
            <div className="space-y-2">
              <Label className="font-bold">اسم الصنف</Label>
              <Input className="rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً: فلتر مكيف" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-bold">الكمية</Label>
                <Input type="number" min={0} className="rounded-xl" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">حد التنبيه</Label>
                <Input type="number" min={0} className="rounded-xl" value={form.min} onChange={(e) => setForm({ ...form, min: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-bold">التصنيف</Label>
                <Input className="rounded-xl" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">المستودع</Label>
                <Input className="rounded-xl" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full rounded-xl font-bold">حفظ الصنف</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
