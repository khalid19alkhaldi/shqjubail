export type BuildingCode = {
  building: string;
  code: string;
  updatedAt: string;
  expiresAt: string; // ISO date (yyyy-mm-dd)
  active: boolean;
};

export const CODES_KEY = "shq_building_codes";

export const DEFAULT_BUILDINGS = [
  "مدرسة الفرقان",
  "مسجد الفاروق",
  "المبنى الإداري",
  "مبنى الأوقاف",
];

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateCode = (len = 6) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");

export const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export const makeCode = (building: string, days = 30): BuildingCode => ({
  building,
  code: generateCode(),
  updatedAt: new Date().toISOString().split("T")[0],
  expiresAt: addDays(days),
  active: true,
});

export const isExpired = (c: BuildingCode) => new Date(c.expiresAt) < new Date(new Date().toDateString());

export const loadCodes = (): BuildingCode[] => {
  if (typeof window === "undefined") return DEFAULT_BUILDINGS.map((b) => makeCode(b));
  try {
    const saved = localStorage.getItem(CODES_KEY);
    if (saved) return JSON.parse(saved) as BuildingCode[];
  } catch {
    /* ignore */
  }
  const seeded = DEFAULT_BUILDINGS.map((b) => makeCode(b));
  try {
    localStorage.setItem(CODES_KEY, JSON.stringify(seeded));
  } catch {
    /* ignore */
  }
  return seeded;
};

export const saveCodes = (codes: BuildingCode[]) => {
  try {
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
  } catch {
    /* ignore */
  }
};

/** يتحقق من صحة الرمز المُدخل لمبنى معيّن */
export const verifyBuildingCode = (building: string, input: string) => {
  const codes = loadCodes();
  const entry = codes.find((c) => c.building === building);
  if (!entry) return { ok: false, reason: "لا يوجد رمز مُصدَر لهذا المبنى، راجع قسم الصيانة." };
  if (!entry.active) return { ok: false, reason: "رمز هذا المبنى موقوف من قسم الصيانة." };
  if (isExpired(entry)) return { ok: false, reason: "انتهت صلاحية رمز المبنى، اطلب رمزاً جديداً من قسم الصيانة." };
  if (input.trim().toUpperCase() !== entry.code) return { ok: false, reason: "الرمز غير صحيح." };
  return { ok: true as const, reason: "" };
};