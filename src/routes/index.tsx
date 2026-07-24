import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  ClipboardList,
  Wrench,
  ShieldCheck,
  BarChart3,
  Users,
  HardHat,
  Bell,
  QrCode,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/logo.png";
import dashboardImg from "@/assets/dashboard.jpg";
import heroBuilding from "@/assets/hero-building.jpg";
import technicianImg from "@/assets/technician.jpg";
import managerImg from "@/assets/manager.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "صيانة | إدارة وصيانة مباني جمعية تحفيظ القرآن بالجبيل" },
      {
        name: "description",
        content:
          "منصة موحّدة لإدارة أوامر العمل والصيانة الوقائية للمرافق التعليمية والمساجد، للموظفين والمقاولين، بواجهة عربية سهلة وتقارير لحظية.",
      },
      {
        property: "og:title",
        content: "صيانة | إدارة وصيانة مباني جمعية تحفيظ القرآن بالجبيل",
      },
      {
        property: "og:description",
        content:
          "منصة موحّدة لإدارة أوامر العمل والصيانة الوقائية للمرافق التعليمية والمساجد، للموظفين والمقاولين، بواجهة عربية سهلة وتقارير لحظية.",
      },
    ],
  }),
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <TrustBar />
      <Features />
      <Workflow />
      <PortalsSection />
      <DashboardPreview />
      <Stats />
      <Contractors />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="شعار المنصة" className="h-12 w-12 rounded-full object-contain" />
          <div className="leading-tight">
            <div className="text-lg font-extrabold text-primary-deep">صيانة</div>
            <div className="text-[11px] text-muted-foreground">
              جمعية تحفيظ القرآن بالجبيل
            </div>
          </div>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 lg:flex">
          <a href="#features" className="hover:text-primary">المزايا</a>
          <a href="#workflow" className="hover:text-primary">آلية العمل</a>
          <a href="#portals" className="hover:text-primary">البوابات</a>
          <a href="#contractors" className="hover:text-primary">المقاولون</a>
          <a href="#cta" className="hover:text-primary">تواصل معنا</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/employee/login" className="hidden rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 sm:inline-flex">
            دخول الموظفين
          </Link>
          <a href="#cta" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-card-soft transition hover:bg-primary-deep">
            اطلب عرضًا
            <ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero text-primary-foreground">
      <div className="pattern-arabesque absolute inset-0 opacity-30" aria-hidden />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold/20 blur-3xl" aria-hidden />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            منصة صيانة المباني للجمعية
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            إدارة وصيانة مباني الجمعية
            <br />
            <span className="text-gold">بكفاءة تشغيلية عالية</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
            منصة موحّدة تربط الموظفين والمقاولين بكل مرافق الجمعية — من المساجد وحلقات
            التحفيظ إلى المدارس والأوقاف — لتتبع أوامر العمل، وجدولة الصيانة الوقائية،
            والاطلاع على تقارير لحظية في مكان واحد.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#cta" className="inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-bold text-gold-foreground shadow-elegant transition hover:brightness-105">
              احجز جولة تعريفية
              <ArrowLeft className="h-4 w-4" />
            </a>
            <a href="#workflow" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10">
              كيف تعمل المنصة؟
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold" />واجهة عربية بالكامل</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold" />متاح على الجوال والويب</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -rotate-3 rounded-3xl bg-gold/20 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 shadow-elegant">
            <img src={heroBuilding} alt="مبنى الجمعية بالجبيل" className="h-full w-full object-cover" width={1600} height={1008} />
          </div>
          <div className="animate-float absolute -bottom-6 -left-6 hidden w-64 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-elegant md:block">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary"><ClipboardList className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">أمر عمل جديد</div>
                <div className="text-sm font-bold">صيانة تكييف — الطابق 2</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="rounded-full bg-accent px-2 py-1 font-semibold text-accent-foreground">عالية الأولوية</span>
              <span className="text-muted-foreground">قبل 5 دقائق</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = ["المساجد", "حلقات التحفيظ", "المدارس النسائية", "المكاتب الإدارية", "الأوقاف", "مرافق الجمعية"];
  return (
    <div className="border-y border-border bg-secondary/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-6 text-sm font-semibold text-muted-foreground">
        <span className="text-xs text-primary-deep">تُدير مرافق الجمعية بمختلف أنواعها:</span>
        {items.map((i) => (
          <span key={i} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{i}</span>
        ))}
      </div>
    </div>
  );
}

const features = [
  { icon: ClipboardList, title: "أوامر العمل", desc: "أنشئ وتابع وأرسل أوامر العمل إلى الموظفين أو المقاولين، مع الحالة والأولوية والمرفقات." },
  { icon: Wrench, title: "الصيانة الوقائية", desc: "جداول دورية للمكيفات والمصاعد والكهرباء والمياه، مع تذكيرات تلقائية ومهام تفتيش." },
  { icon: Building2, title: "إدارة المباني والأصول", desc: "سجل كامل لكل مبنى وطابق وأصل — من مكيف إلى مضخة — مع تاريخ الصيانة والتكاليف." },
  { icon: HardHat, title: "بوابة المقاولين", desc: "استلام الأوامر، تحديث الحالة، رفع صور قبل/بعد، وإصدار الفواتير من واجهة واحدة." },
  { icon: BarChart3, title: "تقارير وتحليلات", desc: "مؤشرات أداء لحظية: زمن الاستجابة، تكلفة الصيانة، المرافق الأعلى استهلاكًا." },
  { icon: ShieldCheck, title: "صلاحيات وحوكمة", desc: "أدوار محددة للموظفين، سجل تدقيق لكل عملية، وتوافق مع سياسات الجمعية." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">المزايا الرئيسية</div>
        <h2 className="mt-4 text-3xl font-black text-primary-deep sm:text-4xl">كل ما تحتاجه لتشغيل المرافق في مكان واحد</h2>
        <p className="mt-4 text-muted-foreground">صُممت المنصة خصيصًا لمرافق الجمعية الخيرية لتحفيظ القرآن الكريم بالجبيل، لتربط بين فريق الصيانة الداخلي والمقاولين الخارجيين بلا تعقيد.</p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card-soft transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-elegant">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-primary-deep">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gold/10 transition group-hover:bg-gold/20" aria-hidden />
          </div>
        ))}
      </div>
    </section>
  );
}

const steps = [
  { n: "01", icon: Bell, title: "بلاغ من الموقع", desc: "يرفع الموظف بلاغًا من الجوال مع صور ووصف وموقع المبنى والطابق." },
  { n: "02", icon: ClipboardList, title: "توجيه الأمر", desc: "يُسنَد الأمر تلقائيًا إلى فني داخلي أو مقاول مختص وفق نوع الصيانة." },
  { n: "03", icon: Wrench, title: "تنفيذ ومتابعة", desc: "يحدّث المنفّذ الحالة، يرفع صور قبل/بعد، ويوثّق قطع الغيار والوقت." },
  { n: "04", icon: CheckCircle2, title: "اعتماد وتقييم", desc: "يعتمد المشرف الإنجاز، ويُحدَّث سجل الأصل، ويصدُر تقييم للمقاول." },
];

function Workflow() {
  return (
    <section id="workflow" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold text-gold-foreground">آلية العمل</div>
            <h2 className="mt-4 text-3xl font-black text-primary-deep sm:text-4xl">من البلاغ إلى الإنجاز في أربع خطوات</h2>
            <p className="mt-4 max-w-md text-muted-foreground">مسار موحّد وواضح لكل عملية صيانة، يمنع الأوامر المعلّقة ويضمن جودة التنفيذ.</p>
            <div className="mt-10 space-y-6">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-gold text-lg font-black text-gold-foreground shadow-card-soft">{s.n}</div>
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-primary-deep"><s.icon className="h-5 w-5 text-primary" />{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-elegant">
              <img src={technicianImg} alt="فني يستخدم تطبيق أوامر العمل" loading="lazy" width={1200} height={1408} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -top-6 -left-6 hidden w-56 rounded-2xl border border-border bg-card p-4 shadow-elegant md:block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-4 w-4 text-primary" />متوسط زمن الاستجابة</div>
              <div className="mt-1 text-2xl font-black text-primary-deep">42 <span className="text-sm text-muted-foreground">دقيقة</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortalsSection() {
  const portals = [
    {
      icon: Users,
      title: "بوابة الموظفين",
      img: managerImg,
      points: ["لوحة تحكم بأوامر العمل حسب المبنى والحالة", "جدولة الصيانة الوقائية والزيارات الميدانية", "إشعارات فورية للتذاكر العاجلة", "تقارير أسبوعية وشهرية جاهزة للطباعة"],
      cta: "دخول الموظفين",
      href: "/employee/login"
    },
    {
      icon: HardHat,
      title: "بوابة المقاولين",
      img: technicianImg,
      points: ["استلام الأوامر المسنَدة والموافقة عليها", "رفع صور «قبل/بعد» وقطع الغيار المستخدمة", "تتبع الفواتير وحالة الدفع", "تقييم الأداء والسمعة"],
      cta: "دخول المقاولين",
      href: "/contractor/login"
    },
  ];
  return (
    <section id="portals" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">البوابات</div>
        <h2 className="mt-4 text-3xl font-black text-primary-deep sm:text-4xl">بوابتان مصممتان بعناية للموظفين والمقاولين</h2>
      </div>
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {portals.map((p) => (
          <div key={p.title} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card-soft transition hover:shadow-elegant">
            <div className="relative h-56 overflow-hidden">
              <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 to-transparent" />
              <div className="absolute bottom-4 right-4 flex items-center gap-3 text-primary-foreground">
                <div className="rounded-xl bg-gold/90 p-2 text-gold-foreground"><p.icon className="h-5 w-5" /></div>
                <h3 className="text-2xl font-black">{p.title}</h3>
              </div>
            </div>
            <div className="p-7">
              <ul className="space-y-3 text-sm">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span className="text-foreground/85">{pt}</span></li>
                ))}
              </ul>
              <Link to={p.href} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-deep">
                {p.cta}<ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-primary-deep py-24 text-primary-foreground">
      <div className="pattern-arabesque absolute inset-0 opacity-25" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold">لوحة التحكم</div>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">رؤية كاملة لجميع مباني الجمعية في شاشة واحدة</h2>
          <p className="mt-4 text-primary-foreground/80">تتبّع الأوامر النشطة، الصيانة القادمة، أداء المقاولين، والتكاليف — كلها لحظيًا.</p>
        </div>
        <div className="mx-auto mt-12 max-w-6xl">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gold/15 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 shadow-elegant">
              <img src={dashboardImg} alt="لوحة تحكم إدارة الصيانة" loading="lazy" width={1600} height={1104} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[{ icon: Smartphone, t: "متاح على الجوال", d: "تطبيق للفنيين في الميدان" }, { icon: QrCode, t: "رمز QR لكل أصل", d: "افتح أمر عمل بمسح واحد" }, { icon: FileText, t: "أرشيف كامل", d: "سجل تدقيق لكل عملية" }].map((c) => (
              <div key={c.t} className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-5 backdrop-blur">
                <c.icon className="h-6 w-6 text-gold" />
                <div className="mt-3 font-bold">{c.t}</div>
                <div className="text-sm text-primary-foreground/70">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "9,379+", l: "طالب وطالبة يخدمهم النظام" },
    { v: "24/7", l: "استقبال البلاغات على مدار الساعة" },
    { v: "42د", l: "متوسط زمن الاستجابة" },
    { v: "%98", l: "نسبة إنجاز أوامر العمل" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-card-soft sm:grid-cols-2 lg:grid-cols-4 lg:p-12">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-4xl font-black text-primary-deep lg:text-5xl">{s.v}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contractors() {
  return (
    <section id="contractors" className="bg-secondary/40 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="order-2 lg:order-1">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold/15 blur-2xl" aria-hidden />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
                <HardHat className="h-8 w-8 text-primary" />
                <div className="mt-3 text-3xl font-black text-primary-deep">36</div>
                <div className="text-xs text-muted-foreground">مقاول معتمد</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft translate-y-6">
                <Wrench className="h-8 w-8 text-gold" />
                <div className="mt-3 text-3xl font-black text-primary-deep">1.2K</div>
                <div className="text-xs text-muted-foreground">أمر عمل شهريًا</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft translate-y-6">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <div className="mt-3 text-3xl font-black text-primary-deep">%100</div>
                <div className="text-xs text-muted-foreground">توثيق للعمليات</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
                <BarChart3 className="h-8 w-8 text-gold" />
                <div className="mt-3 text-3xl font-black text-primary-deep">4.8</div>
                <div className="text-xs text-muted-foreground">متوسط تقييم المقاولين</div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">للمقاولين</div>
          <h2 className="mt-4 text-3xl font-black text-primary-deep sm:text-4xl">انضم إلى شبكة مقاولي الجمعية</h2>
          <p className="mt-4 text-muted-foreground">نظام واضح لاستلام الأوامر، توثيق التنفيذ، ورفع الفواتير — يقلل الوقت الضائع ويضمن الشفافية بين الفريق الفني والجمعية.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {["استلام أوامر مسنَدة بحسب التخصص والمنطقة", "إثبات تنفيذ بالصور والموقع الجغرافي", "تسعير واضح ومتابعة الفواتير حتى الصرف", "تقييم أداء يبني سمعتك مع الجمعية"].map((p) => (
              <li key={p} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />{p}</li>
            ))}
          </ul>
          <a href="#cta" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-deep">
            سجّل كمقاول<ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 text-primary-foreground shadow-elegant lg:p-16">
        <div className="pattern-arabesque absolute inset-0 opacity-30" aria-hidden />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">جاهزون لرفع كفاءة صيانة مرافقكم؟</h2>
            <p className="mt-4 max-w-lg text-primary-foreground/85">احجز جولة تعريفية مع فريقنا لعرض المنصة على بيانات فعلية من مبانيكم، وابدأ التشغيل خلال أيام.</p>
          </div>
          <form id="cta-form" className="space-y-3 rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="text" placeholder="الاسم الكامل" className="w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:border-gold focus:outline-none" />
              <input type="text" placeholder="الجهة / القسم" className="w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:border-gold focus:outline-none" />
            </div>
            <input type="tel" placeholder="رقم الجوال" className="w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:border-gold focus:outline-none" />
            <textarea rows={3} placeholder="أخبرنا عن احتياجك…" className="w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:border-gold focus:outline-none" />
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-gold px-5 py-3 text-sm font-bold text-gold-foreground shadow-elegant transition hover:brightness-105">
              اطلب عرضًا الآن<ArrowLeft className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-primary-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="شعار الجمعية" className="h-14 w-14 rounded-full" />
            <div>
              <div className="text-lg font-extrabold">صيانة</div>
              <div className="text-xs text-primary-foreground/70">منصة إدارة وصيانة مباني الجمعية الخيرية لتحفيظ القرآن الكريم بالجبيل</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/70">نعمل لخدمة كتاب الله، ونهتم بأدق تفاصيل تشغيل المرافق لضمان بيئة تعليمية آمنة ومستدامة لجيل القرآن.</p>
        </div>
        <div>
          <div className="text-sm font-bold text-gold">روابط سريعة</div>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
            <li><a href="#features" className="hover:text-gold">المزايا</a></li>
            <li><a href="#workflow" className="hover:text-gold">آلية العمل</a></li>
            <li><a href="#portals" className="hover:text-gold">البوابات</a></li>
            <li><a href="#contractors" className="hover:text-gold">المقاولون</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-bold text-gold">تواصل معنا</div>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />محافظة الجبيل — المنطقة الشرقية</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" />9200 12345</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" />support@siyana-plus.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-primary-foreground/60 sm:flex-row">
          <div>© {new Date().getFullYear()} جميع الحقوق محفوظة — جمعية تحفيظ القرآن بالجبيل</div>
          <div>مستوحى تصميمًا من هوية الجمعية</div>
        </div>
      </div>
    </footer>
  );
}