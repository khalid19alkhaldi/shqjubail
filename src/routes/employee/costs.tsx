import { createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { employeeSidebarItems } from "@/lib/employee-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Wallet, Plus, Download, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/employee/costs")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") throw redirect({ to: "/employee/login" });
    }
  },
  component: EmployeeCosts,
});

type Expense = { id: string; date: string; building: string; category: string; desc: string; amount: number };

const BUILDINGS = ["مدرسة الفرقان", "مسجد الفاروق", "المبنى الإداري", "مبنى الأوقاف"];
const CATEGORIES = ["تكييف", "كهرباء", "سباكة", "دهانات", "مصاعد", "أمن وسلامة"];
const STORAGE_KEY = "shq_expenses";
const BUDGET_KEY = "shq_budget";

const DEFAULT_EXPENSES: Expense[] = [
  { id: "EX-1001", date: "2026-07-02", building: "مدرسة الفرقان", category: "تكييف", desc: "تغيير كمبروسر سبليت", amount: 4200 },
  { id: "EX-1002", date: "2026-07-09", building: "مسجد الفاروق", category: "سباكة", desc: "معالجة تسرب دورات المياه", amount: 1800 },
  { id: "EX-1003", date: "2026-07-15", building: "المبنى الإداري", category: "مصاعد", desc: "عقد صيانة ربع سنوي", amount: 6500 },
  { id: "EX-1004", date: "2026-07-21", building: "مبنى الأوقاف", category: "كهرباء", desc: "استبدال لوحة توزيع", amount: 2750 },
];

const fmt = (n: number) => n.toLocaleString("en-US");

function EmployeeCosts() {
  const [expenses, setExpenses] = React.useState<Expense[]>(DEFAULT_EXPENSES);
  const [budget, setBudget] = React.useState(50000);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ building: BUILDINGS[0], category: CATEGORIES[0], desc: "", amount: "", date: new Date().toISOString().split("T")[0] });

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { try { setExpenses(JSON.parse(saved)); } catch { /* ignore */ } }
    const b = localStorage.getItem(BUDGET_KEY);
    if (b) setBudget(Number(b) || 50000);
  }, []);

  const persist = (next: Expense[]) => {
    setExpenses(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveBudget = (v: number) => {
    setBudget(v);
    localStorage.setItem(BUDGET_KEY, String(v));
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const usage = budget > 0 ? Math.min(100, Math.round((total / budget) * 100)) : 0;

  const byBuilding = BUILDINGS.map((b) => ({
    name: b,
    total: expenses.filter((e) => e.building === b).reduce((s, e) => s + e.amount, 0),
  })).sort((a, b) => b.total - a.total);

  const addExpense = () => {
    const amount = Number(form.amount);
    if (!form.desc.trim() || !amount || amount <= 0) {
      toast.error("أدخل وصفاً ومبلغاً صحيحاً أكبر من صفر.");
      return;
    }
    persist([{ id: `EX-${Math.floor(Math.random() * 9000) + 1000}`, date: form.date, building: form.building, category: form.category, desc: form.desc.trim(), amount }, ...expenses]);
    setOpen(false);
    setForm({ ...form, desc: "", amount: "" });
    toast.success("تمت إضافة المصروف");
  };

  const exportCsv = () => {
    const rows = [["الرقم", "التاريخ", "المبنى", "البند", "الوصف", "المبلغ"], ...expenses.map((e) => [e.id, e.date, e.building, e.category, e.desc, String(e.amount)])];
    const csv = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.download = "maintenance-costs.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير التقرير");
  };

  return (
    <PortalLayout title="الميزانية والتكاليف" items={employeeSidebarItems}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-primary-deep">الميزانية والتكاليف</h2>
            <p className="text-sm text-muted-foreground">تتبع مصروفات الصيانة لكل مبنى ومقارنتها بالميزانية المعتمدة.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={exportCsv}><Download className="h-4 w-4" /> تصدير CSV</Button>
            <Button className="gap-2 rounded-xl" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> مصروف جديد</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">إجمالي المصروف</p>
              <p className="mt-1 text-2xl font-bold">{fmt(total)} ر.س</p>
              <div className="mt-3"><Progress value={usage} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{usage}% من الميزانية</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">الميزانية السنوية</p>
              <div className="mt-2 flex gap-2">
                <Input className="rounded-xl" type="number" value={budget} onChange={(e) => saveBudget(Number(e.target.value))} />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Wallet className="h-5 w-5" /></div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">المتبقي: {fmt(Math.max(0, budget - total))} ر.س</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-card-soft">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">أعلى مبنى تكلفة</p>
              <p className="mt-1 text-lg font-bold">{byBuilding[0]?.name}</p>
              <p className="text-sm text-muted-foreground">{fmt(byBuilding[0]?.total || 0)} ر.س</p>
              {usage >= 80 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                  <AlertTriangle className="h-4 w-4" /> اقتربت من حد الميزانية
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-card-soft">
          <CardContent className="space-y-3 p-5 sm:p-6">
            <div className="flex items-center gap-2 font-bold text-primary-deep"><TrendingUp className="h-4 w-4" /> التوزيع حسب المبنى</div>
            {byBuilding.map((b) => (
              <div key={b.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{b.name}</span>
                  <span className="font-bold">{fmt(b.total)} ر.س</span>
                </div>
                <Progress value={total ? (b.total / total) * 100 : 0} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-card-soft">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-right text-sm">
                <thead className="bg-secondary/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3 font-bold">الرقم</th>
                    <th className="p-3 font-bold">التاريخ</th>
                    <th className="p-3 font-bold">المبنى</th>
                    <th className="p-3 font-bold">البند</th>
                    <th className="p-3 font-bold">الوصف</th>
                    <th className="p-3 font-bold">المبلغ</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="p-3 font-medium">{e.id}</td>
                      <td className="p-3 text-muted-foreground">{e.date}</td>
                      <td className="p-3">{e.building}</td>
                      <td className="p-3">{e.category}</td>
                      <td className="p-3">{e.desc}</td>
                      <td className="p-3 font-bold">{fmt(e.amount)} ر.س</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { persist(expenses.filter((x) => x.id !== e.id)); toast.success("تم حذف المصروف"); }}>حذف</Button>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">لا توجد مصروفات مسجلة.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-right">تسجيل مصروف صيانة</DialogTitle>
            <DialogDescription className="text-right">سيُضاف المبلغ إلى إجمالي مصروفات المبنى.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold">المبنى</Label>
                <Select value={form.building} onValueChange={(v) => setForm({ ...form, building: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{BUILDINGS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">البند</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">التاريخ</Label>
                <Input type="date" className="rounded-xl" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">المبلغ (ر.س)</Label>
                <Input type="number" className="rounded-xl" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold">الوصف</Label>
              <Input className="rounded-xl" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="وصف مختصر للمصروف" />
            </div>
          </div>
          <DialogFooter>
            <Button className="rounded-xl" onClick={addExpense}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
