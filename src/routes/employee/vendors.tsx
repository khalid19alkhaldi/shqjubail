import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { employeeSidebarItems } from "@/lib/employee-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Phone, Mail, Star, HardHat, Clock, ShieldCheck, FileText } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/employee/vendors")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeeVendors,
});

type Vendor = {
  id: string; name: string; specialty: string; phone: string; email: string;
  contractEnd: string; onTime: number; completed: number; rating: number;
};

const DEFAULT_VENDORS: Vendor[] = [
  { id: "V1", name: "مؤسسة صيانة الشرق", specialty: "تكييف وكهرباء", phone: "0138123456", email: "info@sharq-maint.sa", contractEnd: "2026-12-31", onTime: 92, completed: 148, rating: 5 },
  { id: "V2", name: "شركة الجبيل للمقاولات", specialty: "سباكة وترميم", phone: "0138765432", email: "ops@jubail-con.sa", contractEnd: "2026-09-30", onTime: 78, completed: 63, rating: 4 },
  { id: "V3", name: "مؤسسة أمان للسلامة", specialty: "أنظمة الحريق", phone: "0135551122", email: "safety@aman.sa", contractEnd: "2027-03-15", onTime: 88, completed: 41, rating: 4 },
  { id: "V4", name: "شركة المصاعد الحديثة", specialty: "مصاعد", phone: "0138889900", email: "service@modern-lifts.sa", contractEnd: "2026-08-20", onTime: 65, completed: 22, rating: 3 },
];

const STORAGE_KEY = "shq_vendor_ratings";

function daysLeft(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

function EmployeeVendors() {
  const [vendors, setVendors] = React.useState<Vendor[]>(DEFAULT_VENDORS);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const ratings: Record<string, number> = JSON.parse(saved);
        setVendors(DEFAULT_VENDORS.map(v => ratings[v.id] ? { ...v, rating: ratings[v.id] } : v));
      } catch { /* ignore */ }
    }
  }, []);

  const rate = (id: string, value: number) => {
    const next = vendors.map(v => v.id === id ? { ...v, rating: value } : v);
    setVendors(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(next.map(v => [v.id, v.rating]))));
    toast.success("تم حفظ التقييم");
  };

  const filtered = vendors.filter(v => (v.name + v.specialty).includes(query.trim()));

  return (
    <PortalLayout title="المقاولون والتقييم" items={employeeSidebarItems}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-primary-deep">دليل المقاولين المعتمدين</h2>
          <p className="text-sm text-muted-foreground">بيانات التواصل، حالة العقود، ونسب الالتزام بالمواعيد</p>
        </div>

        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث باسم المقاول أو التخصص..." className="rounded-xl max-w-md" />

        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((v) => {
            const left = daysLeft(v.contractEnd);
            return (
              <Card key={v.id} className="border-none shadow-card-soft">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <HardHat className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-primary-deep">{v.name}</div>
                        <div className="text-xs text-muted-foreground">{v.specialty}</div>
                      </div>
                    </div>
                    <Badge className={left < 60 ? "bg-amber-100 text-amber-700 border-none" : "bg-green-100 text-green-700 border-none"}>
                      {left > 0 ? `العقد ينتهي خلال ${left} يوم` : "العقد منتهي"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-secondary/30 rounded-xl py-2">
                      <div className="text-lg font-black text-primary-deep">{v.onTime}%</div>
                      <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1"><Clock className="h-3 w-3" /> الالتزام</div>
                    </div>
                    <div className="bg-secondary/30 rounded-xl py-2">
                      <div className="text-lg font-black text-primary-deep">{v.completed}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3" /> أوامر منجزة</div>
                    </div>
                    <div className="bg-secondary/30 rounded-xl py-2">
                      <div className="text-lg font-black text-primary-deep">{v.contractEnd}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1"><FileText className="h-3 w-3" /> نهاية العقد</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => rate(v.id, n)} aria-label={`تقييم ${n}`}>
                          <Star className={`h-5 w-5 ${n <= v.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="rounded-xl gap-1">
                        <a href={`tel:${v.phone}`}><Phone className="h-4 w-4" /> اتصال</a>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="rounded-xl gap-1">
                        <a href={`mailto:${v.email}`}><Mail className="h-4 w-4" /> مراسلة</a>
                      </Button>
                    </div>
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
