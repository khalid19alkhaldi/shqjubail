# نظام تسجيل الدخول وإدارة الأدوار (Auth & RBAC)

سنقوم بتحويل نظام الدخول التجريبي الحالي إلى نظام متكامل لإدارة الجلسات والأدوار، مما يضمن أن الموظفين لا يمكنهم الوصول لصفحات المقاولين والعكس، مع توجيه المستخدمين غير المسجلين لصفحات الدخول.

## Proposed Changes

### [إدارة حالة المستخدم (Authentication Store)]

#### [NEW] [use-auth.tsx](file:///C:/Projects/shqjubail-main/src/hooks/use-auth.tsx)
إنشاء `AuthContext` لإدارة حالة تسجيل الدخول، تخزين بيانات المستخدم، والدور الوظيفي (`employee` أو `contractor`). سيحتوي على دوال:
- `login(username, password, type)`: للتحقق من البيانات وتخزين الجلسة.
- `logout()`: لإنهاء الجلسة.
- `isAuthenticated`: متغير بوليني.

### [حماية المسارات (Route Guarding)]

#### [MODIFY] [router.tsx](file:///C:/Projects/shqjubail-main/src/router.tsx)
تحديث سياق الرواتر (Router Context) ليشمل بيانات المصادقة، مما يسمح لنا باستخدامها في حماية المسارات.

#### [MODIFY] [src/routes/employee/index.tsx](file:///C:/Projects/shqjubail-main/src/routes/employee/index.tsx) و [src/routes/contractor/index.tsx](file:///C:/Projects/shqjubail-main/src/routes/contractor/index.tsx)
إضافة خاصية `beforeLoad` للمسارات المحمية. ستقوم هذه الخاصية بالتأكد من:
1. أن المستخدم مسجل الدخول.
2. أن دور المستخدم يطابق المسار المطلوب (مثلاً: الموظف لا يدخل لوحة المقاول).
3. التوجيه لصفحة تسجيل الدخول إذا لم تتحقق الشروط.

### [تحديث واجهات تسجيل الدخول]

#### [MODIFY] [login.tsx](file:///C:/Projects/shqjubail-main/src/routes/employee/login.tsx) و [login.tsx](file:///C:/Projects/shqjubail-main/src/routes/contractor/login.tsx)
ربط النماذج بدالة `login` من الـ `AuthContext` بدلاً من التوجيه المباشر.

## بيانات الدخول للتجربة (Mock Users)

> [!NOTE]
> سيتم استخدام البيانات التالية للتجربة في هذه المرحلة:
> - **الموظفين:** اسم المستخدم `admin` وكلمة المرور `admin`.
> - **المقاولين:** رمز المقاول `vendor` وكلمة المرور `vendor`.

## Verification Plan

### Automated Tests
- فحص منطق الـ `beforeLoad` للتأكد من منع الوصول غير المصرح به.

### Manual Verification
1. محاولة الدخول المباشر إلى `/employee` بدون تسجيل الدخول -> يجب التوجيه لـ `/employee/login`.
2. تسجيل الدخول كمقاول ثم محاولة الدخول لـ `/employee` -> يجب المنع أو التوجيه لصفحة المقاول.
3. التأكد من ظهور اسم المستخدم الصحيح في لوحة التحكم بعد الدخول.
