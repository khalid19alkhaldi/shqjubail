import { createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";
import { z } from "zod";
import { PortalLayout } from "@/components/PortalLayout";
import { CheckCircle2, Wrench, History, Loader2, AlertCircle, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getOrders, updateOrderStatus } from "@/lib/data-service";
import { TECH_TASKS } from "@/lib/mock-data";

export const Route = createFileRoute("/technician/status")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "technician") {
        throw redirect({ to: "/technician/login" });
      }
    }
  },
  component: TechnicianStatus,
});

const sidebarItems = [
  { title: "مهامي اليوم", icon: Wrench, href: "/technician" },
  { title: "المهام السابقة", icon: History, href: "/technician/history" },
  { title: "تحديث الحالة", icon: CheckCircle2, href: "/technician/status" },
];

const STATUSES = ["نشط", "قيد التنفيذ", "بانتظار قطع غيار", "مكتمل"];
const NOTES_REQUIRED = ["بانتظار قطع غيار", "مكتمل"];
const LOCAL_KEY = "shq_tech_status_updates";

const statusSchema = z
  .object({
    status: z
      .string()
      .refine((v) => STATUSES.includes(v), { message: "اختر حالة صحيحة للمهمة" }),
    notes: z.string().trim().max(500, { message: "الملاحظات يجب ألا تتجاوز 500 حرف" }),
    progress: z
      .number({ invalid_type_error: "أدخل نسبة إنجاز صحيحة" })
      .min(0, { message: "نسبة الإنجاز بين 0 و 100" })
      .max(100, { message: "نسبة الإنجاز بين 0 و 100" }),
  })
  .superRefine((val, ctx) => {
    if (NOTES_REQUIRED.includes(val.status) && val.notes.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["notes"],
        message: "الملاحظات مطلوبة (5 أحرف على الأقل) لهذه الحالة",
      });
    }
    if (val.status === "مكتمل" && val.progress !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["progress"],
        message: "عند اختيار «مكتمل» يجب أن تكون نسبة الإنجاز 100%",
      });
    }
  });

type FormState = { status: string; notes: string; progress: string };
type Errors = Partial<Record<"status" | "notes" | "progress", string>>;

function TechnicianStatus() {
  const [tasks, setTasks] = React.useState<any[]>(TECH_TASKS);
  const [forms, setForms] = React.useState<Record<string, FormState>>({});
  const [errors, setErrors] = React.useState<Record<string, Errors>>({});
  const [saving, setSaving] = React.useState<string | null>(null);

  const readLocal = (): Record<string, any> => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    } catch {
      return {};
    }
  };

  React.useEffect(() => {
    (async () => {
      const orders = await getOrders();
      const active = orders.filter((o: any) => o.status !== "مكتمل");
      const list = active.length ? active : TECH_TASKS;
      const saved = readLocal();
      const merged = list.map((t: any) => (saved[t.id] ? { ...t, ...saved[t.id] } : t));
      setTasks(merged);
      setForms(
        Object.fromEntries(
          merged.map((t: any) => [
            t.id,
            {
              status: t.status ?? "نشط",
              notes: saved[t.id]?.notes ?? t.notes ?? "",
              progress: String(saved[t.id]?.progress ?? t.progress ?? 0),
            } as FormState,
          ])
        )
      );
    })();
  }, []);

  const setField = (id: string, key: keyof FormState, value: string) => {
    setForms((p) => ({ ...p, [id]: { ...p[id], [key]: value } }));
    setErrors((p) => ({ ...p, [id]: { ...p[id], [key]: undefined } }));
  };

  const handleSubmit = async (e: React.FormEvent, task: any) => {
    e.preventDefault();
    const form = forms[task.id] ?? { status: task.status, notes: "", progress: "0" };
    const parsed = statusSchema.safeParse({
      status: form.status,
      notes: form.notes ?? "",
      progress: form.progress === "" ? NaN : Number(form.progress),
    });

    if (!parsed.success) {
      const fieldErrors: Errors = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof Errors;
        if (k && !fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors((p) => ({ ...p, [task.id]: fieldErrors }));
      toast.error("تعذر الحفظ", { description: "يرجى تصحيح الحقول المطلوبة." });
      return;
    }

    const payload = {
      notes: parsed.data.notes,
      progress: parsed.data.progress,
      updated_at: new Date().toISOString(),
    };

    setSaving(task.id);
    try {
      await updateOrderStatus(task.id, parsed.data.status, payload);
      const saved = readLocal();
      saved[task.id] = { status: parsed.data.status, ...payload };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(saved));
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: parsed.data.status, ...payload } : t))
      );
      setErrors((p) => ({ ...p, [task.id]: {} }));
      toast.success("تم حفظ التحديث", { description: `${task.title} → ${parsed.data.status}` });
    } catch {
      toast.error("تعذر حفظ التحديث، حاول مرة أخرى.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <PortalLayout title="تحديث الحالة" items={sidebarItems}>
      <div className="space-y-5 w-full max-w-3xl mx-auto pb-10">
        <div className="bg-primary-deep text-white p-5 sm:p-6 rounded-[1.75rem] shadow-elegant">
          <div className="text-xs opacity-70 mb-1">تحديث ميداني فوري</div>
          <h2 className="text-lg sm:text-xl font-black">{tasks.length} مهمة قيد المتابعة</h2>
        </div>

        {tasks.map((task) => {
          const form = forms[task.id] ?? { status: task.status, notes: "", progress: "0" };
          const err = errors[task.id] || {};
          const notesRequired = NOTES_REQUIRED.includes(form.status);
          return (
            <Card key={task.id} className="border-none shadow-card-soft rounded-[1.5rem]">
              <CardContent className="p-4 sm:p-5">
                <form onSubmit={(e) => handleSubmit(e, task)} className="space-y-4" noValidate>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-black text-base sm:text-lg text-primary-deep break-words">
                      {task.title}
                    </h4>
                    <Badge className="bg-primary/10 text-primary border-none">{task.status}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground break-words">
                    {task.building || task.location || "—"}
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-deep">الحالة الجديدة *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STATUSES.map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={form.status === s ? "default" : "outline"}
                          disabled={saving === task.id}
                          className="rounded-xl h-11 text-xs font-bold"
                          onClick={() => setField(task.id, "status", s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                    {err.status && <FieldError message={err.status} />}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-xs font-bold text-primary-deep"
                      htmlFor={`progress-${task.id}`}
                    >
                      نسبة الإنجاز (%) *
                    </label>
                    <Input
                      id={`progress-${task.id}`}
                      type="number"
                      min={0}
                      max={100}
                      inputMode="numeric"
                      value={form.progress}
                      onChange={(e) => setField(task.id, "progress", e.target.value)}
                      className="rounded-2xl bg-white h-11 text-sm"
                    />
                    {err.progress && <FieldError message={err.progress} />}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-xs font-bold text-primary-deep"
                      htmlFor={`notes-${task.id}`}
                    >
                      ملاحظات الفني {notesRequired ? "*" : "(اختياري)"}
                    </label>
                    <Textarea
                      id={`notes-${task.id}`}
                      value={form.notes}
                      maxLength={500}
                      onChange={(e) => setField(task.id, "notes", e.target.value)}
                      placeholder={
                        notesRequired ? "اذكر تفاصيل الحالة أو القطع المطلوبة" : "ملاحظات إضافية"
                      }
                      className="rounded-2xl bg-white min-h-[80px] text-sm"
                    />
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{err.notes ? <FieldError message={err.notes} /> : null}</span>
                      <span>{form.notes.length}/500</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={saving === task.id}
                    className="w-full rounded-2xl h-12 font-bold"
                  >
                    {saving === task.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 ml-2" /> حفظ التحديث
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-16">
            لا توجد مهام نشطة حالياً.
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <span className="flex items-center gap-1 text-[11px] font-bold text-destructive">
      <AlertCircle className="h-3 w-3" /> {message}
    </span>
  );
}