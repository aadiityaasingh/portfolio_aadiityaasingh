import React from "react";
import {
  Activity,
  BriefcaseBusiness,
  House,
  BrainCircuit,
  Database,
  ShieldAlert,
  Code,
  Code2,
  Globe,
  Layers,
  Cpu,
  Terminal,
  Sparkles,
  Smartphone,
  Server,
  Laptop,
  Rocket,
  Flame,
  Zap,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { name: "Code2", component: Code2, label: "Languages / Code" },
  { name: "Globe", component: Globe, label: "Web / SaaS" },
  { name: "Cpu", component: Cpu, label: "Tools / Systems" },
  { name: "Layers", component: Layers, label: "Full Stack / Infra" },
  { name: "Terminal", component: Terminal, label: "CLI / Backend" },
  { name: "Database", component: Database, label: "Database / Storage" },
  { name: "Server", component: Server, label: "Cloud / Server" },
  { name: "Activity", component: Activity, label: "Health / Activity" },
  { name: "BriefcaseBusiness", component: BriefcaseBusiness, label: "Business / Job" },
  { name: "House", component: House, label: "Real Estate / Home" },
  { name: "BrainCircuit", component: BrainCircuit, label: "AI / ML" },
  { name: "ShieldAlert", component: ShieldAlert, label: "Security / Shield" },
  { name: "Code", component: Code, label: "Code / Dev" },
  { name: "Sparkles", component: Sparkles, label: "Creative / Design" },
  { name: "Smartphone", component: Smartphone, label: "Mobile App" },
  { name: "Laptop", component: Laptop, label: "Web App" },
  { name: "Rocket", component: Rocket, label: "Startup / Product" },
  { name: "Flame", component: Flame, label: "Trending" },
  { name: "Zap", component: Zap, label: "Fast / Utility" },
  { name: "Award", component: Award, label: "Certificate / Award" },
  { name: "Briefcase", component: Briefcase, label: "Work / Experience" },
];

export const COLOR_THEMES = [
  {
    name: "White to Green (Emerald)",
    color: "from-white to-green-400",
    bgAccent: "bg-emerald-500/10",
    previewClass: "bg-emerald-400",
  },
  {
    name: "Gray to Blue",
    color: "from-gray-200 to-blue-500",
    bgAccent: "bg-blue-500/10",
    previewClass: "bg-blue-500",
  },
  {
    name: "Gray to Red",
    color: "from-gray-300 to-red-500",
    bgAccent: "bg-red-500/10",
    previewClass: "bg-red-500",
  },
  {
    name: "White to Gray (Silver)",
    color: "from-white to-gray-500",
    bgAccent: "bg-gray-500/10",
    previewClass: "bg-gray-400",
  },
  {
    name: "Purple to Pink",
    color: "from-purple-400 to-pink-600",
    bgAccent: "bg-purple-500/10",
    previewClass: "bg-purple-500",
  },
  {
    name: "Amber to Yellow",
    color: "from-amber-400 to-yellow-600",
    bgAccent: "bg-amber-500/10",
    previewClass: "bg-amber-500",
  },
  {
    name: "Violet to Indigo",
    color: "from-violet-400 to-indigo-600",
    bgAccent: "bg-violet-500/10",
    previewClass: "bg-violet-500",
  },
  {
    name: "Rose to Red",
    color: "from-rose-400 to-red-600",
    bgAccent: "bg-rose-500/10",
    previewClass: "bg-rose-500",
  },
];

export function renderProjectIcon(iconName, size = 40) {
  if (React.isValidElement(iconName)) return iconName;
  const found = AVAILABLE_ICONS.find((item) => item.name === iconName);
  const IconComponent = found ? found.component : Activity;
  return <IconComponent size={size} />;
}

export function renderSkillIcon(iconName, size = 28) {
  if (React.isValidElement(iconName)) return iconName;
  const found = AVAILABLE_ICONS.find((item) => item.name === iconName);
  const IconComponent = found ? found.component : Code2;
  return <IconComponent size={size} />;
}
