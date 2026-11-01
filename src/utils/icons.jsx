import React from "react";
import {
  Activity,
  BriefcaseBusiness,
  House,
  BrainCircuit,
  Database,
  ShieldAlert,
  Code,
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
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { name: "Activity", component: Activity, label: "Health / Activity" },
  { name: "BriefcaseBusiness", component: BriefcaseBusiness, label: "Business / Job" },
  { name: "House", component: House, label: "Real Estate / Home" },
  { name: "BrainCircuit", component: BrainCircuit, label: "AI / ML" },
  { name: "Database", component: Database, label: "Database / Storage" },
  { name: "ShieldAlert", component: ShieldAlert, label: "Security / Shield" },
  { name: "Code", component: Code, label: "Code / Dev" },
  { name: "Globe", component: Globe, label: "Web / SaaS" },
  { name: "Layers", component: Layers, label: "Full Stack" },
  { name: "Cpu", component: Cpu, label: "Systems / Hardware" },
  { name: "Terminal", component: Terminal, label: "CLI / Backend" },
  { name: "Sparkles", component: Sparkles, label: "Creative / Design" },
  { name: "Smartphone", component: Smartphone, label: "Mobile App" },
  { name: "Server", component: Server, label: "Cloud / Server" },
  { name: "Laptop", component: Laptop, label: "Web App" },
  { name: "Rocket", component: Rocket, label: "Startup / Product" },
  { name: "Flame", component: Flame, label: "Trending" },
  { name: "Zap", component: Zap, label: "Fast / Utility" },
];

export const COLOR_THEMES = [
  {
    name: "Emerald Teal",
    color: "from-emerald-400 to-teal-600",
    bgAccent: "bg-emerald-500/10",
    previewClass: "bg-emerald-500",
  },
  {
    name: "Blue Cyan",
    color: "from-blue-400 to-cyan-600",
    bgAccent: "bg-blue-500/10",
    previewClass: "bg-blue-500",
  },
  {
    name: "Orange Red",
    color: "from-orange-400 to-red-600",
    bgAccent: "bg-orange-500/10",
    previewClass: "bg-orange-500",
  },
  {
    name: "Purple Pink",
    color: "from-purple-400 to-pink-600",
    bgAccent: "bg-purple-500/10",
    previewClass: "bg-purple-500",
  },
  {
    name: "Amber Yellow",
    color: "from-amber-400 to-yellow-600",
    bgAccent: "bg-amber-500/10",
    previewClass: "bg-amber-500",
  },
  {
    name: "Violet Indigo",
    color: "from-violet-400 to-indigo-600",
    bgAccent: "bg-violet-500/10",
    previewClass: "bg-violet-500",
  },
  {
    name: "Rose Red",
    color: "from-rose-400 to-red-600",
    bgAccent: "bg-rose-500/10",
    previewClass: "bg-rose-500",
  },
];

export function renderProjectIcon(iconName, size = 40) {
  const found = AVAILABLE_ICONS.find((item) => item.name === iconName);
  const IconComponent = found ? found.component : Activity;
  return <IconComponent size={size} />;
}
