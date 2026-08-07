import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  Wrench,
  HardHat,
  Users,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Bell,
} from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "صيانة | بوابة الصيانة الداخلية — جمعية تحفيظ القرآن بالجبيل" },
      {
        name: "description",
        content:
          "بوابة الدخول الداخلية لمنصة صيانة مباني جمعية تحفيظ القرآن بالجبيل. للموظفين والمقاولين والفنيين.",
      },
      {
        property: "og:title",
        content: "صيانة | بوابة الصيانة الداخلية — جمعية تحفيظ القرآن بالجبيل",
      },
      {
        property: "og:description",
        content:
          "بوابة الدخول الداخلية لمنصة صيانة مباني جمعية تحفيظ القرآن بالجبيل. للموظفين والمقاولين والفنيين.",
      },
    ],
  }),
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />
      <main>
        <Hero />
        <Portals />
        <Workflow />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="شعار الجمعية" className="h-10 w-10 rounded-full object-contain" />
          <div className="leading-tight">
            <div className="font-extrabold text-primary-deep">صيانة</div>
            <div className="text-[11px] text-muted-foreground">جمعية تحفيظ القرآن بالجبيل</div>
          </div>
        </div>
        <Link
          to="/request"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-deep"
        >
          بلاغ صيانة
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero text-primary-foreground">
      <div className="pattern-arabesque absolute inset-0 opacity-25" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <Bell className="h-3.5 w-3.5" />
            بوابة التشغيل والصيانة
          </div>
          <h1 className="mt-6 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            نظام إدارة أوامر العمل والصيانة
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            منصة داخلية تربط موظفي الصيانة بالمقاولين والفنيين، لتسجيل البلاغات،
            توجيه الأوامر، ومتابعة الإنجاز — كلها في مكان واحد.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/request"
              className="inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-bold text-gold-foreground shadow-elegant transition hover:brightness-105"
            >
              رفع بلاغ صيانة
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/employee/login"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              دخول الموظفين
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const portals = [
  {
    icon: Users,
    title: "بوابة الموظفين",
    desc: "إنشاء أوامر العمل، جدولة الصيانة الوقائية، إدارة المباني والأصول، ومراجعة التقارير.",
    cta: "دخول الموظفين",
    href: "/employee/login",
  },
  {
    icon: Wrench,
    title: "بوابة الفنيين",
    desc: "عرض المهام اليومية، تحديث حالة الإنجاز، رفع الصور والملاحظات من الميدان.",
    cta: "دخول الفنيين",
    href: "/technician/login",
  },
  {
    icon: HardHat,
    title: "بوابة المقاولين",
    desc: "استلام الأوامر المسندة، تقديم خطة تنفيذ، تحديث الحالة، وتوثيق الإنجاز.",
    cta: "دخول المقاولين",
    href: "/contractor/login",
  },
];

function Portals() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          البوابات
        </div>
        <h2 className="mt-4 text-2xl font-black text-primary-deep sm:text-3xl">اختر بوابتك للدخول</h2>
        <p className="mt-2 text-sm text-muted-foreground">كل قسم له واجهته الخاصة حسب دوره في عملية الصيانة.</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {portals.map((p) => (
          <div
            key={p.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card-soft transition hover:border-gold/50 hover:shadow-elegant"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <p.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-primary-deep">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            <Link
              to={p.href}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-deep"
            >
              {p.cta}
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

const steps = [
  {
    icon: Bell,
    title: "استلام البلاغ",
    desc: "الموظف أو المستفيد يرفع بلاغًا مع تحديد المبنى والموقع والوصف.",
  },
  {
    icon: ClipboardList,
    title: "توجيه الأمر",
    desc: "يُسند الأمر إلى فني داخلي أو مقاول خارجي حسب نوع الصيانة والتخصص.",
  },
  {
    icon: Wrench,
    title: "التنفيذ والمتابعة",
    desc: "يحدّث المنفذ الحالة والنسبة المئوية للإنجاز ويرفع الصور والملاحظات.",
  },
  {
    icon: CheckCircle2,
    title: "الاعتماد والإغلاق",
    desc: "يعتمد الموظف المسؤول الإنجاز ويُغلق الأمر ويُحدَّث سجل الأصل.",
  },
];

function Workflow() {
  return (
    <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold text-gold-foreground">
            آلية العمل
          </div>
          <h2 className="mt-4 text-2xl font-black text-primary-deep sm:text-3xl">مسار أمر العمل من البلاغ إلى الإغلاق</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-card p-5 shadow-card-soft">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl gradient-gold text-sm font-black text-gold-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="flex items-center gap-2 font-bold text-primary-deep">
                <s.icon className="h-4 w-4 text-primary" />
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-primary-deep text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="شعار الجمعية" className="h-12 w-12 rounded-full" />
            <div>
              <div className="font-extrabold">صيانة</div>
              <div className="text-xs text-primary-foreground/70">منصة إدارة وصيانة مباني الجمعية الخيرية لتحفيظ القرآن الكريم بالجبيل</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-primary-foreground/80 sm:text-right">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              محافظة الجبيل — المنطقة الشرقية
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              9200 12345
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" />
              support@siyana-plus.com
            </li>
          </ul>
        </div>
        <div className="mt-8 border-t border-primary-foreground/10 pt-5 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} جميع الحقوق محفوظة — جمعية تحفيظ القرآن بالجبيل
        </div>
      </div>
    </footer>
  );
}
