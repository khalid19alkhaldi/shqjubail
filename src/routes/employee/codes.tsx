import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { employeeSidebarItems } from "@/lib/employee-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { KeyRound, RefreshCw, Copy, Plus, Power, Download } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  BuildingCode, loadCodes, saveCodes, makeCode, isExpired, addDays, generateCode,
} from "@/lib/building-codes";

export const Route = createFileRoute("/employee/codes")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeeCodes,
});

function EmployeeCodes() {
  const [codes, setCodes] = React.useState<BuildingCode[]>([]);
  const [days, setDays] = React.useState("30");
  const [newBuilding, setNewBuilding] = React.useState("");

  React.useEffect(() => {
    setCodes(loadCodes());
  }, []);

  const persist = (next: BuildingCode[]) => {
    setCodes(next);
    saveCodes(next);
  };

  const validity = () => {
    const n = parseInt(days, 10);
    return Number.isFinite(n) && n > 0 && n <= 365 ? n : 30;
  };

  const renew = (building: string) => {
    persist(
      codes.map((c) =>
        c.building === building
          ? { ...c, code: generateCode(), updatedAt: new Date().toISOString().split("T")[0], expiresAt: addDays(validity()), active: true }
          : c,
      ),
    );
    toast.success(`تم تجديد رمز ${building}`, { description: `صالح لمدة ${validity()} يوم.` });
  };

  const renewAll = () => {
    persist(codes.map((c) => ({ ...c, code: generateCode(), updatedAt: new Date().toISOString().split("T")[0], expiresAt: addDays(validity()), active: true })));
    toast.success("تم تجديد رموز جميع المباني");
  };

  const toggle = (building: string) => {
    persist(codes.map((c) => (c.building === building ? { ...c, active: !c.active } : c)));
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("تم نسخ الرمز");
    } catch {
      toast.error("تعذر النسخ");
    }
  };

  const addBuilding = () => {
    const name = newBuilding.trim();
    if (name.length < 3) {
      toast.error("اسم المبنى قصير جداً");
      return;
    }
    if (codes.some((c) => c.building === name)) {
      toast.error("المبنى موجود مسبقاً");
      return;
    }
    persist([...codes, makeCode(name, validity())]);
    setNewBuilding("");
    toast.success(`تم إصدار رمز جديد لـ ${name}`);
  };

  const exportCsv = () => {
    const rows = [
      ["المبنى", "الرمز", "تاريخ الإصدار", "تاريخ الانتهاء", "الحالة"],
      ...codes.map((c) => [c.building, c.code, c.updatedAt, c.expiresAt, c.active ? (isExpired(c) ? "منتهي" : "فعال") : "موقوف"]),
    ];
    const csv = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "building-codes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PortalLayout title="رموز المباني" items={employeeSidebarItems}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-primary-deep sm:text-2xl">رموز دخول البلاغات</h1>
            <p className="text-sm text-muted-foreground">
              الرموز تُصدر وتُجدَّد من قسم الصيانة، وتُسلَّم لمنسوبي كل مرفق لاستخدامها في صفحة البلاغ العام.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">مدة الصلاحية (يوم)</Label>
              <Input className="w-28 rounded-xl" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} />
            </div>
            <Button onClick={renewAll} className="gap-2 rounded-xl">
              <RefreshCw className="h-4 w-4" /> تجديد الكل
            </Button>
            <Button variant="outline" onClick={exportCsv} className="gap-2 rounded-xl">
              <Download className="h-4 w-4" /> تصدير
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-card-soft">
          <CardContent className="flex flex-wrap items-end gap-2 p-4 sm:p-5">
            <div className="min-w-[220px] flex-1 space-y-1">
              <Label className="text-xs font-bold">إضافة مبنى وإصدار رمز له</Label>
              <Input className="rounded-xl" value={newBuilding} onChange={(e) => setNewBuilding(e.target.value)} placeholder="اسم المبنى" />
            </div>
            <Button onClick={addBuilding} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> إصدار رمز
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {codes.map((c) => {
            const expired = isExpired(c);
            return (
              <Card key={c.building} className="border-none shadow-card-soft">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-primary-deep">
                      <KeyRound className="h-4 w-4 text-gold" /> {c.building}
                    </div>
                    <Badge
                      className={`border-none ${
                        !c.active ? "bg-muted text-muted-foreground" : expired ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {!c.active ? "موقوف" : expired ? "منتهي" : "فعال"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3">
                    <span className="font-mono text-lg font-bold tracking-[0.2em]">{c.code}</span>
                    <Button size="icon" variant="ghost" className="rounded-xl" onClick={() => copy(c.code)} aria-label="نسخ الرمز">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    صدر في {c.updatedAt} • ينتهي في {c.expiresAt}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-2 rounded-xl" onClick={() => renew(c.building)}>
                      <RefreshCw className="h-4 w-4" /> تجديد
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-2 rounded-xl" onClick={() => toggle(c.building)}>
                      <Power className="h-4 w-4" /> {c.active ? "إيقاف" : "تفعيل"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}