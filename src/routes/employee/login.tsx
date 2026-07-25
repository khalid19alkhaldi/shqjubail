import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, User, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/employee/login")({
  component: EmployeeLogin,
});

function EmployeeLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock login logic: admin/admin
      if (username === "admin" && password === "admin") {
        await login(username, "employee", "أحمد المحمد");
        toast.success("تم تسجيل الدخول بنجاح");
        // Use a slight delay before navigation to avoid race conditions in WebView
        setTimeout(() => {
          navigate({ to: "/employee" });
        }, 100);
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
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
          <h1 className="text-2xl font-black text-primary-deep">صيانة الجمعية</h1>
          <p className="text-muted-foreground text-sm mt-1">بوابة تسجيل دخول الموظفين</p>
        </div>

        <Card className="border-border shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center">مرحباً بك مجدداً</CardTitle>
            <CardDescription className="text-center">أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="أدخل اسم المستخدم"
                    className="pr-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    className="pr-10"
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
                className="w-full h-11 text-base font-bold bg-primary hover:bg-primary-deep"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    تسجيل الدخول
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="h-3 w-3" />
                الدخول محمي لسياسات الجمعية
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-primary hover:underline font-medium">العودة للرئيسية</a>
        </div>
      </div>
    </div>
  );
}
