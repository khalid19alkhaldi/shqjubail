import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ClipboardList, Search, CheckCircle2, ArrowRight } from "lucide-react";
import { saveOrder, getOrders } from "@/lib/data-service";
import { loadCodes, verifyBuildingCode } from "@/lib/building-codes";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/request")({
  component: PublicRequestPage,
});

const CATEGORIES = ["تكييف", "كهرباء", "سباكة", "دهانات", "مصاعد", "أمن وسلامة"];
const PRIORITIES = ["عالية", "متوسطة", "منخفضة"];

// رموز المباني تُصدر وتُجدَّد من قسم الصيانة (بوابة الموظفين ← رموز المباني)

const RATE_KEY = "shq_request_rate";
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const getRecentSubmissions = (): number[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(RATE_KEY) || "[]") as number[];
    return raw.filter((t) => Date.now() - t < RATE_WINDOW_MS);
  } catch {
    return [];
  }
};

function PublicRequestPage() {
  const [buildings, setBuildings] = React.useState<string[]>([]);
  const [form, setForm] = React.useState({
    name: "", phone: "", building: "", category: CATEGORIES[0],
    priority: "متوسطة", title: "", desc: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [ticket, setTicket] = React.useState<string | null>(null);
  const [trackId, setTrackId] = React.useState("");
  const [trackResult, setTrackResult] = React.useState<any>(null);
  const [tracked, setTracked] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");

  React.useEffect(() => {
    const list = loadCodes().filter((c) => c.active).map((c) => c.building);
    setBuildings(list);
    setForm((f) => ({ ...f, building: f.building || list[0] || "" }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim()) return; // فخ للبوتات
    if (!form.name.trim() || !/^0\d{9}$/.test(form.phone.trim()) || form.title.trim().length < 5) {
      toast.error("تحقق من البيانات", {
        description: "الاسم مطلوب، الجوال بصيغة 05xxxxxxxx، وعنوان البلاغ 5 أحرف على الأقل.",
      });
      return;
    }
    const check = verifyBuildingCode(form.building, code);
    if (!check.ok) {
      toast.error("تعذر التحقق من رمز المبنى", { description: check.reason });
      return;
    }
    const recent = getRecentSubmissions();
    if (recent.length >= RATE_LIMIT) {
      toast.error("تجاوزت الحد المسموح", {
        description: `يمكن إرسال ${RATE_LIMIT} بلاغات كحد أقصى خلال ساعة. حاول لاحقاً.`,
      });
      return;
    }
    setLoading(true);
    const id = `WO-${Math.floor(Math.random() * 9000) + 1000}`;
    try {
      await saveOrder({
        id,
        title: form.title.trim(),
        building: form.building,
        category: form.category,
        priority: form.priority,
        status: "بانتظار التحقق",
        date: new Date().toISOString().split("T")[0],
        contractor: "غير مسند",
        desc: `${form.desc}\nمقدم البلاغ: ${form.name} - ${form.phone}`,
      });
      try {
        localStorage.setItem(RATE_KEY, JSON.stringify([...recent, Date.now()]));
      } catch {}
      setTicket(id);
      toast.success(`تم استلام بلاغك برقم ${id}`, {
        description: "سيتم التحقق منه من قسم الصيانة قبل الإسناد.",
      });
      setForm({ ...form, title: "", desc: "" });
      setCode("");
    } catch {
      toast.error("تعذر إرسال البلاغ، حاول لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    const orders = await getOrders();
    const found = orders.find((o: any) => String(o.id).toLowerCase() === trackId.trim().toLowerCase());
    setTrackResult(found || null);
    setTracked(true);
  };

  return (
    <div className="min-h-screen bg-secondary/30" dir="rtl">
      <header className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="شعار الجمعية" className="h-10 w-10 rounded-full" />
            <div>
              <div className="font-bold text-gold">بلاغ صيانة</div>
              <div className="text-[10px] opacity-70">جمعية تحفيظ القرآن بالجبيل</div>
            </div>
          </div>
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold opacity-90 hover:opacity-100">
            الرئيسية <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-10">
        <div>
          <h1 className="text-2xl font-bold text-primary-deep">تقديم بلاغ صيانة</h1>
          <p className="text-sm text-muted-foreground">يمكن لمنسوبي المرافق رفع بلاغ مباشرة دون الحاجة لحساب، ومتابعته برقم البلاغ.</p>
        </div>

        {ticket && (
          <Card className="border-none shadow-card-soft bg-primary/5">
            <CardContent className="flex items-center gap-3 p-5">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <div>
                <div className="font-bold text-primary-deep">تم استلام البلاغ بنجاح</div>
                <p className="text-sm text-muted-foreground">رقم المتابعة: <span className="font-bold">{ticket}</span> — البلاغ الآن «بانتظار التحقق» من قسم الصيانة.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-none shadow-card-soft lg:col-span-2">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">الاسم</Label>
                    <Input className="rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم الثلاثي" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">رقم الجوال</Label>
                    <Input className="rounded-xl" inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05xxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">المبنى</Label>
                    <Select value={form.building} onValueChange={(v) => setForm({ ...form, building: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{buildings.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">نوع العطل</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">الأولوية</Label>
                    <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">عنوان البلاغ</Label>
                    <Input className="rounded-xl" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثلاً: عطل مكيف الفصل الثاني" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">رمز المبنى</Label>
                    <Input className="rounded-xl" value={code} onChange={(e) => setCode(e.target.value)} placeholder="الرمز المسلَّم من قسم الصيانة" />
                    <p className="text-[11px] text-muted-foreground">رمز متجدد يُصدره قسم الصيانة لكل مبنى وله تاريخ انتهاء.</p>
                  </div>
                </div>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute h-0 w-0 opacity-0"
                />
                <div className="space-y-2">
                  <Label className="text-sm font-bold">وصف المشكلة</Label>
                  <Textarea className="rounded-xl" rows={4} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="اذكر تفاصيل إضافية تساعد الفني" />
                </div>
                <Button type="submit" className="w-full gap-2 rounded-xl" disabled={loading}>
                  <ClipboardList className="h-4 w-4" />
                  {loading ? "جاري الإرسال..." : "إرسال البلاغ"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-card-soft h-fit">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="font-bold text-primary-deep">متابعة بلاغ</div>
              <form onSubmit={track} className="flex gap-2">
                <Input className="rounded-xl" value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="WO-5521" />
                <Button type="submit" size="icon" className="rounded-xl shrink-0"><Search className="h-4 w-4" /></Button>
              </form>
              {tracked && !trackResult && <p className="text-sm text-muted-foreground">لا يوجد بلاغ بهذا الرقم.</p>}
              {trackResult && (
                <div className="space-y-2 rounded-xl border border-border p-4">
                  <div className="text-sm font-bold">{trackResult.title}</div>
                  <div className="text-xs text-muted-foreground">{trackResult.building} • {trackResult.date}</div>
                  <Badge className="bg-primary/10 text-primary border-none">{trackResult.status}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
