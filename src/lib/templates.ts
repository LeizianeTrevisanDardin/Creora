export type TemplatePlatform =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "other";

export type TemplateDuration =
  | 10
  | 15
  | 30;

export type TemplateVideoStyle =
  | "ugc"
  | "cinematic"
  | "lifestyle"
  | "product-demo";

export type TemplateCategory =
  | "Lifestyle"
  | "UGC"
  | "Product"
  | "Education"
  | "Travel";

export type TemplateIcon =
  | "sun"
  | "sparkles"
  | "shopping"
  | "lightbulb"
  | "map"
  | "video";

export type CreoraTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  videoPrompt: string;
  platform: TemplatePlatform;
  duration: TemplateDuration;
  style: TemplateVideoStyle;
  icon: TemplateIcon;
  gradient: string;
};

const TEMPLATE_TO_USE_KEY =
  "creora_template_to_use";

export const CREORA_TEMPLATES:
  CreoraTemplate[] = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    category: "Lifestyle",
    description:
      "A fast, personal routine video built around three simple habits.",
    videoPrompt:
      "Create a morning routine video with 3 habits that make the day feel better. Open with a strong personal hook, keep each habit short and visual, and finish with a natural creator-style takeaway.",
    platform: "tiktok",
    duration: 15,
    style: "lifestyle",
    icon: "sun",
    gradient:
      "linear-gradient(135deg, #fef3c7 0%, #fde68a 45%, #fbcfe8 100%)",
  },
  {
    id: "grwm-story",
    name: "GRWM Story",
    category: "Lifestyle",
    description:
      "Get Ready With Me storytelling with a casual, relatable flow.",
    videoPrompt:
      "Create a Get Ready With Me video that tells a short personal story while the creator gets ready. Start with an intriguing hook, keep the pacing natural, and end with a memorable final thought.",
    platform: "instagram",
    duration: 30,
    style: "lifestyle",
    icon: "sparkles",
    gradient:
      "linear-gradient(135deg, #ede9fe 0%, #f5d0fe 50%, #fce7f3 100%)",
  },
  {
    id: "product-review",
    name: "Product Review",
    category: "Product",
    description:
      "Show the product, the problem it solves and a natural creator verdict.",
    videoPrompt:
      "Create an authentic creator-style product review. Introduce the problem first, show the product in use, highlight 3 clear benefits, mention one realistic detail, and finish with a natural recommendation.",
    platform: "tiktok",
    duration: 30,
    style: "product-demo",
    icon: "shopping",
    gradient:
      "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 48%, #fae8ff 100%)",
  },
  {
    id: "quick-tips",
    name: "3 Quick Tips",
    category: "Education",
    description:
      "A compact educational format for useful tips and mini tutorials.",
    videoPrompt:
      "Create a short educational video with 3 practical tips. Begin with a clear benefit-driven hook, make every tip immediately useful, use concise language, and end with a simple call to save the video.",
    platform: "instagram",
    duration: 15,
    style: "ugc",
    icon: "lightbulb",
    gradient:
      "linear-gradient(135deg, #fef9c3 0%, #dcfce7 50%, #dbeafe 100%)",
  },
  {
    id: "travel-mini-guide",
    name: "Travel Mini Guide",
    category: "Travel",
    description:
      "Turn one destination into a polished mini guide with quick recommendations.",
    videoPrompt:
      "Create a cinematic mini travel guide for one destination. Open with why the place is worth visiting, include 3 must-see or must-do recommendations, keep the visuals energetic, and end with a travel-save CTA.",
    platform: "instagram",
    duration: 30,
    style: "cinematic",
    icon: "map",
    gradient:
      "linear-gradient(135deg, #cffafe 0%, #bfdbfe 48%, #ddd6fe 100%)",
  },
  {
    id: "hook-story-cta",
    name: "Hook + Story + CTA",
    category: "UGC",
    description:
      "A versatile creator structure for personal stories, offers and recommendations.",
    videoPrompt:
      "Create a UGC video using a Hook, Story, CTA structure. Start with a pattern-interrupting hook, tell a short relatable story with one clear transformation, and finish with a direct but natural call to action.",
    platform: "tiktok",
    duration: 15,
    style: "ugc",
    icon: "video",
    gradient:
      "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 45%, #fbcfe8 100%)",
  },
];

function canUseBrowserStorage() {
  return typeof window !==
    "undefined";
}

export function setTemplateToUse(
  templateId: string,
) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.sessionStorage.setItem(
    TEMPLATE_TO_USE_KEY,
    templateId,
  );
}

export function consumeTemplateToUse() {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const templateId =
    window.sessionStorage.getItem(
      TEMPLATE_TO_USE_KEY,
    );

  if (!templateId) {
    return null;
  }

  window.sessionStorage.removeItem(
    TEMPLATE_TO_USE_KEY,
  );

  return (
    CREORA_TEMPLATES.find(
      (template) =>
        template.id ===
        templateId,
    ) ?? null
  );
}
