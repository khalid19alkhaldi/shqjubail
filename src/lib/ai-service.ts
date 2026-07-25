import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with a placeholder or environment variable
const API_KEY = ""; // User can fill this later
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface AiResponse {
  diagnosis: string;
  steps: string[];
  safetyWarnings: string[];
  partsNeeded: string[];
  urgency: "low" | "medium" | "high";
}

export const getAiMaintenanceAdvice = async (problemDescription: string): Promise<AiResponse> => {
  // If no API key, use the Smart Simulator
  if (!genAI) {
    return simulateAiResponse(problemDescription);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an expert maintenance engineer. Analyze this problem: "${problemDescription}".
    Provide a JSON response with the following keys in Arabic:
    "diagnosis" (short summary),
    "steps" (array of repair steps),
    "safetyWarnings" (array of safety tips),
    "partsNeeded" (array of possible spare parts),
    "urgency" ("low", "medium", or "high").`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Simple parsing logic (in real apps use a more robust JSON extractor)
    try {
      return JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
    } catch (e) {
      return simulateAiResponse(problemDescription);
    }
  } catch (error) {
    console.error("AI Error:", error);
    return simulateAiResponse(problemDescription);
  }
};

const simulateAiResponse = (description: string): AiResponse => {
  const desc = description.toLowerCase();

  if (desc.includes("مكيف") || desc.includes("تكييف") || desc.includes("حر")) {
    return {
      diagnosis: "عطل محتمل في مروحة التكثيف أو نقص في غاز الفريون.",
      steps: [
        "فحص فلتر الهواء الداخلي وتنظيفه.",
        "التأكد من عمل الوحدة الخارجية وصوت الضاغط.",
        "قياس ضغط الغاز باستخدام المانومتر."
      ],
      safetyWarnings: [
        "يجب فصل التيار الكهربائي قبل فتح غطاء الوحدة الخارجية.",
        "استخدام قفازات واقية عند التعامل مع الأنابيب النحاسية."
      ],
      partsNeeded: ["أسطوانة فريون R410A", "كابستور (Capacitor) 45uf"],
      urgency: "medium"
    };
  }

  if (desc.includes("كهرباء") || desc.includes("نار") || desc.includes("حريق")) {
    return {
      diagnosis: "خطر تماس كهربائي ناتج عن حمل زائد أو تلف في القاطع الرئيسي.",
      steps: [
        "فصل القاطع الرئيسي فوراً من لوحة التوزيع.",
        "فحص الأسلاك للتأكد من عدم وجود انصهار.",
        "استبدال القاطع المتضرر بآخر مطابق للمواصفات."
      ],
      safetyWarnings: [
        "تحذير: لا تحاول لمس الأسلاك العارية بيدك.",
        "تأكد من جفاف الأرضية تماماً قبل البدء."
      ],
      partsNeeded: ["قاطع كهربائي (Circuit Breaker) 32A", "شريط عازل (Electrical Tape)"],
      urgency: "high"
    };
  }

  return {
    diagnosis: "تحليل أولي: المشكلة تتطلب معاينة ميدانية دقيقة للتأكد.",
    steps: [
      "معاينة الموقع وتصوير العطل بشكل أوضح.",
      "مراجعة سجل صيانة المبنى للأعطال المشابهة.",
      "إجراء فحص أولي للمكونات المحيطة بالعطل."
    ],
    safetyWarnings: ["ارتداء أدوات السلامة المعتمدة من الجمعية."],
    partsNeeded: ["شنطة العدة الأساسية"],
    urgency: "low"
  };
};

export const getAiSummary = (description: string): string => {
  // Simple logic for employee portal summary
  if (description.length < 30) return description;
  return description.substring(0, 45) + "... (تم تلخيصها بالذكاء الاصطناعي)";
};
