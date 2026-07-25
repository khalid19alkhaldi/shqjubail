import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, UserCog, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/technician/login")({
  component: TechnicianLogin,
});

function TechnicianLogin() {
  const [techId, setTechId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock login logic: tech/tech
      if (techId === "tech" && password === "tech") {
        await login(techId, "technician", "سالم العتيبي");
        toast.success("مرحباً بك يا سالم، تم تسجيل دخولك بنجاح");
        setTimeout(() => {
          navigate({ to: "/technician" });
        }, 100);
      } else {
        toast.error("الرقم الوظيفي أو كلمة المرور غير صحيحة");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ غير متوقع");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="شعار الجمعية" className="mx-auto h-20 w-20 rounded-full shadow-elegant mb-4" />
          <h1 className="text-2xl font-black text-primary-deep">بوابة الفنيين</h1>
          <p className="text-muted-foreground text-sm mt-1">إدارة المهام الميدانية والعمليات</p>
        </div>

        <Card className="border-border shadow-elegant">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold">تسجيل دخول الميدان</CardTitle>
            <CardDescription>أدخل الرقم الوظيفي للبدء</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="techId">الرقم الوظيفي</Label>
                <div className="relative">
                  <UserCog className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="techId"
                    name="username"
                    autoComplete="username"
                    placeholder="مثال: T-200"
                    className="pr-10 rounded-xl"
                    value={techId}
                    onChange={(e) => setTechId(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-10 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-11 text-base font-bold bg-primary hover:bg-primary-deep rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    دخول للميدان
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center">
                <ShieldCheck className="h-3 w-3" />
                هذه البوابة مخصصة لفنيي الجمعية المعتمدين
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:underline">العودة للرئيسية</a>
        </div>
      </div>
    </div>
  );
}
