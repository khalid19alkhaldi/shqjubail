import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, Building, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/contractor/login")({
  component: ContractorLogin,
});

function ContractorLogin() {
  const [vendorCode, setVendorCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorCode && password) {
      navigate({ to: "/contractor" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="شعار الجمعية" className="mx-auto h-20 w-20 rounded-full shadow-elegant mb-4" />
          <h1 className="text-2xl font-black text-primary-deep">بوابة المقاولين</h1>
          <p className="text-muted-foreground text-sm mt-1">إدارة أوامر العمل المسندة</p>
        </div>

        <Card className="border-border shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-center">دخول المقاولين المعتمدين</CardTitle>
            <CardDescription className="text-center">استخدم رمز المقاول وكلمة السر للمتابعة</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vendorCode">رمز المقاول</Label>
                <div className="relative">
                  <Building className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vendorCode"
                    placeholder="مثال: V-12345"
                    className="pr-10"
                    value={vendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 text-base font-bold bg-primary hover:bg-primary-deep">
                تسجيل الدخول
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <HardHat className="h-3 w-3" />
                للمقاولين المعتمدين فقط
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center space-y-2">
          <a href="/register-contractor" className="block text-sm text-primary hover:underline">طلب اعتماد مقاول جديد</a>
          <a href="/" className="block text-sm text-muted-foreground hover:underline">العودة للرئيسية</a>
        </div>
      </div>
    </div>
  );
}
