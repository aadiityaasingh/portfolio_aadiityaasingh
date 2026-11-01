import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Github,
  Star,
  ArrowUp,
  ArrowDown,
  LogOut,
  Search,
  Check,
  X,
  Layers,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  RefreshCw,
  Cpu,
  Briefcase,
  Award,
  FolderGit2,
  MapPin,
  ListPlus,
} from "lucide-react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  reorderCertifications,
  verifyAdminToken,
} from "../../utils/api";
import {
  AVAILABLE_ICONS,
  COLOR_THEMES,
  renderProjectIcon,
  renderSkillIcon,
} from "../../utils/icons";

const POPULAR_PROJECT_TAGS = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "TailwindCSS",
  "Vite",
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Docker",
  "Redis",
  "GSAP",
  "Framer Motion",
  "Swagger",
];

const POPULAR_SKILL_TAGS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "SQL",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "FastAPI",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Git",
  "GitHub",
  "Postman",
  "Vercel",
  "Render",
  "Tailwind CSS",
  "Socket.IO",
  "GraphQL",
  "AWS",
  "Swagger",
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState("projects"); // "projects" | "skills" | "experience" | "certifications"
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAdmin, setActiveAdmin] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Data States
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Modal / Editing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states per tab
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tech: [],
    github: "",
    live: "",
    image: "",
    icon: "Activity",
    color: "from-blue-400 to-cyan-600",
    bgAccent: "bg-blue-500/10",
    featured: false,
  });

  const [skillForm, setSkillForm] = useState({
    category: "",
    description: "",
    skills: [],
    icon: "Code2",
    color: "from-white to-green-400",
  });

  const [experienceForm, setExperienceForm] = useState({
    role: "",
    company: "",
    date: "",
    points: [""],
  });

  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    date: "",
    credentialUrl: "",
  });

  const [editingItem, setEditingItem] = useState(null);
  const [tagInput, setTagInput] = useState("");

  // Authenticate on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyAdminToken();
        if (res.success) {
          setActiveAdmin(res.admin);
          loadAllData();
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        handleLogout();
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("portfolio_admin_user");
    navigate("/admin", { replace: true });
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [projRes, skillRes, expRes, certRes] = await Promise.allSettled([
        getProjects(),
        getSkills(),
        getExperiences(),
        getCertifications(),
      ]);

      if (projRes.status === "fulfilled" && projRes.value?.data) {
        setProjects(projRes.value.data);
      }
      if (skillRes.status === "fulfilled" && skillRes.value?.data) {
        setSkills(skillRes.value.data);
      }
      if (expRes.status === "fulfilled" && expRes.value?.data) {
        setExperiences(expRes.value.data);
      }
      if (certRes.status === "fulfilled" && certRes.value?.data) {
        setCertifications(certRes.value.data);
      }
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
      showNotice("error", "Failed to fetch some sections from server.");
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage({ type: "", text: "" });
    }, 4000);
  };

  // Open Modal Helpers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setTagInput("");

    if (activeTab === "projects") {
      setProjectForm({
        title: "",
        description: "",
        tech: [],
        github: "",
        live: "",
        image: "",
        icon: "Activity",
        color: "from-blue-400 to-cyan-600",
        bgAccent: "bg-blue-500/10",
        featured: false,
      });
    } else if (activeTab === "skills") {
      setSkillForm({
        category: "",
        description: "",
        skills: [],
        icon: "Code2",
        color: "from-white to-green-400",
      });
    } else if (activeTab === "experience") {
      setExperienceForm({
        role: "",
        company: "",
        date: "",
        points: [""],
      });
    } else if (activeTab === "certifications") {
      setCertForm({
        title: "",
        issuer: "",
        date: "",
        credentialUrl: "",
      });
    }

    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setTagInput("");

    if (activeTab === "projects") {
      setProjectForm({
        title: item.title || "",
        description: item.description || "",
        tech: Array.isArray(item.tech) ? item.tech : [],
        github: item.github || "",
        live: item.live || "",
        image: item.image || "",
        icon: item.icon || "Activity",
        color: item.color || "from-blue-400 to-cyan-600",
        bgAccent: item.bgAccent || "bg-blue-500/10",
        featured: Boolean(item.featured),
      });
    } else if (activeTab === "skills") {
      setSkillForm({
        category: item.category || "",
        description: item.description || "",
        skills: Array.isArray(item.skills) ? item.skills : [],
        icon: item.icon || "Code2",
        color: item.color || "from-white to-green-400",
      });
    } else if (activeTab === "experience") {
      setExperienceForm({
        role: item.role || "",
        company: item.company || "",
        date: item.date || "",
        points: Array.isArray(item.points) && item.points.length > 0 ? item.points : [""],
      });
    } else if (activeTab === "certifications") {
      setCertForm({
        title: item.title || "",
        issuer: item.issuer || "",
        date: item.date || "",
        credentialUrl: item.credentialUrl || "",
      });
    }

    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (activeTab === "projects") {
        if (!projectForm.title.trim() || !projectForm.description.trim()) {
          showNotice("error", "Project Title and Description are required.");
          setSubmitting(false);
          return;
        }
        if (editingItem) {
          await updateProject(editingItem._id, projectForm);
          showNotice("success", "Project updated successfully!");
        } else {
          await createProject(projectForm);
          showNotice("success", "Project added successfully!");
        }
        const res = await getProjects();
        if (res.data) setProjects(res.data);
      } else if (activeTab === "skills") {
        if (!skillForm.category.trim()) {
          showNotice("error", "Category name is required.");
          setSubmitting(false);
          return;
        }
        if (editingItem) {
          await updateSkill(editingItem._id, skillForm);
          showNotice("success", "Skill category updated successfully!");
        } else {
          await createSkill(skillForm);
          showNotice("success", "Skill category added successfully!");
        }
        const res = await getSkills();
        if (res.data) setSkills(res.data);
      } else if (activeTab === "experience") {
        if (!experienceForm.role.trim() || !experienceForm.company.trim() || !experienceForm.date.trim()) {
          showNotice("error", "Role, Company, and Date are required.");
          setSubmitting(false);
          return;
        }
        const cleanPoints = experienceForm.points.map((p) => p.trim()).filter(Boolean);
        const payload = { ...experienceForm, points: cleanPoints };

        if (editingItem) {
          await updateExperience(editingItem._id, payload);
          showNotice("success", "Experience updated successfully!");
        } else {
          await createExperience(payload);
          showNotice("success", "Experience added successfully!");
        }
        const res = await getExperiences();
        if (res.data) setExperiences(res.data);
      } else if (activeTab === "certifications") {
        if (!certForm.title.trim()) {
          showNotice("error", "Certification title is required.");
          setSubmitting(false);
          return;
        }
        if (editingItem) {
          await updateCertification(editingItem._id, certForm);
          showNotice("success", "Certification updated successfully!");
        } else {
          await createCertification(certForm);
          showNotice("success", "Certification added successfully!");
        }
        const res = await getCertifications();
        if (res.data) setCertifications(res.data);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      showNotice("error", err.response?.data?.message || "Failed to save item.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    try {
      if (activeTab === "projects") {
        await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else if (activeTab === "skills") {
        await deleteSkill(id);
        setSkills((prev) => prev.filter((s) => s._id !== id));
      } else if (activeTab === "experience") {
        await deleteExperience(id);
        setExperiences((prev) => prev.filter((e) => e._id !== id));
      } else if (activeTab === "certifications") {
        await deleteCertification(id);
        setCertifications((prev) => prev.filter((c) => c._id !== id));
      }
      showNotice("success", "Deleted successfully.");
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Delete error:", err);
      showNotice("error", "Failed to delete item.");
    }
  };

  // Reorder Handler
  const handleMoveOrder = async (index, direction) => {
    let list, setList, reorderFn;
    if (activeTab === "projects") {
      list = [...projects];
      setList = setProjects;
      reorderFn = reorderProjects;
    } else if (activeTab === "skills") {
      list = [...skills];
      setList = setSkills;
      reorderFn = reorderSkills;
    } else if (activeTab === "experience") {
      list = [...experiences];
      setList = setExperiences;
      reorderFn = reorderExperiences;
    } else if (activeTab === "certifications") {
      list = [...certifications];
      setList = setCertifications;
      reorderFn = reorderCertifications;
    }

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    setList(list);

    try {
      const orderedIds = list.map((item) => item._id);
      await reorderFn(orderedIds);
      showNotice("success", "Order updated!");
    } catch (err) {
      console.error("Reorder failed:", err);
      showNotice("error", "Failed to persist new order on server.");
      loadAllData();
    }
  };

  // Toggle Featured Project
  const handleToggleFeatured = async (project) => {
    try {
      const updated = !project.featured;
      await updateProject(project._id, { featured: updated });
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, featured: updated } : p))
      );
      showNotice("success", `Project marked as ${updated ? "Featured" : "Standard"}.`);
    } catch (err) {
      console.error("Toggle featured failed:", err);
      showNotice("error", "Failed to update project status.");
    }
  };

  // Tag helper
  const handleAddTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;

    if (activeTab === "projects") {
      if (!projectForm.tech.includes(trimmed)) {
        setProjectForm((prev) => ({ ...prev, tech: [...prev.tech, trimmed] }));
      }
    } else if (activeTab === "skills") {
      if (!skillForm.skills.includes(trimmed)) {
        setSkillForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      }
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    if (activeTab === "projects") {
      setProjectForm((prev) => ({ ...prev, tech: prev.tech.filter((t) => t !== tag) }));
    } else if (activeTab === "skills") {
      setSkillForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== tag) }));
    }
  };

  // Experience point helpers
  const handleAddPoint = () => {
    setExperienceForm((prev) => ({ ...prev, points: [...prev.points, ""] }));
  };

  const handlePointChange = (val, idx) => {
    setExperienceForm((prev) => {
      const next = [...prev.points];
      next[idx] = val;
      return { ...prev, points: next };
    });
  };

  const handleRemovePoint = (idx) => {
    setExperienceForm((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== idx),
    }));
  };

  // Filter lists based on search
  const currentFilteredList = () => {
    const q = searchQuery.toLowerCase();
    if (activeTab === "projects") {
      return projects.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tech?.some((t) => t.toLowerCase().includes(q))
      );
    } else if (activeTab === "skills") {
      return skills.filter(
        (s) =>
          s.category?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.skills?.some((t) => t.toLowerCase().includes(q))
      );
    } else if (activeTab === "experience") {
      return experiences.filter(
        (e) =>
          e.role?.toLowerCase().includes(q) ||
          e.company?.toLowerCase().includes(q) ||
          e.points?.some((p) => p.toLowerCase().includes(q))
      );
    } else if (activeTab === "certifications") {
      return certifications.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.issuer?.toLowerCase().includes(q)
      );
    }
    return [];
  };

  const displayList = currentFilteredList();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Background radial glow */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-outfit font-black text-lg shadow-lg shadow-blue-500/20">
              AS
            </div>
            <div>
              <h1 className="text-base font-outfit font-bold tracking-tight text-white flex items-center gap-2">
                PORTFOLIO ADMIN
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                  Control Center
                </span>
              </h1>
              <p className="text-xs text-white/50">{activeAdmin?.email || "aditya@portfolio.dev"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all"
            >
              <ExternalLink size={14} />
              View Live Portfolio
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-mono text-red-400 hover:text-red-300 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 relative z-10">
        {/* Status Toast */}
        <AnimatePresence>
          {statusMessage.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border shadow-xl ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {statusMessage.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0e0e0e] border border-white/10 rounded-2xl mb-8">
          <button
            onClick={() => {
              setActiveTab("projects");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "projects"
                ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderGit2 size={16} />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("skills");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "skills"
                ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Cpu size={16} />
            <span>Technical Stack ({skills.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("experience");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "experience"
                ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase size={16} />
            <span>Experience ({experiences.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("certifications");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
              activeTab === "certifications"
                ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Award size={16} />
            <span>Certifications ({certifications.length})</span>
          </button>
        </div>

        {/* Dashboard Section Header & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-3xl font-outfit font-black tracking-tight text-white mb-2 capitalize">
              {activeTab === "skills"
                ? "Technical Stack Categories"
                : activeTab === "experience"
                ? "Professional Experience"
                : activeTab === "certifications"
                ? "Certifications & Credentials"
                : "Projects Showcase"}
            </h2>
            <p className="text-sm text-white/60">
              {activeTab === "skills"
                ? "Manage your skill groups (Languages, Web & Backend, Tools, Infrastructure) and their tech chips."
                : activeTab === "experience"
                ? "Add or update job roles, company details, dates, and bullet points."
                : activeTab === "certifications"
                ? "Manage certifications, credential links, and issuing organizations."
                : "Add new projects, update existing ones, upload previews, or drag to reorder."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadAllData}
              title="Refresh data"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-medium text-sm text-white shadow-lg shadow-blue-500/25 transition-all group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>
                {activeTab === "skills"
                  ? "Add Skill Category"
                  : activeTab === "experience"
                  ? "Add Experience"
                  : activeTab === "certifications"
                  ? "Add Certification"
                  : "Add Project"}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this section..."
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/40">
            <div className="w-10 h-10 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-mono">Loading data from MongoDB Atlas...</p>
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-white/5 bg-white/[0.02]">
            <Layers size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-bold font-outfit text-white mb-2">No Items Found</h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
              {searchQuery ? "No items match your search query." : "You haven't added any items here yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors"
              >
                <Plus size={16} />
                Create First Item
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayList.map((item, index) => (
              <motion.div
                key={item._id || index}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-[#0b0b0b] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* PROJECTS ITEM */}
                {activeTab === "projects" && (
                  <div className="flex items-start gap-5 flex-grow">
                    <div
                      className={`p-3.5 rounded-2xl ${item.bgAccent || "bg-blue-500/10"} border border-white/10 shrink-0 text-white flex items-center justify-center`}
                    >
                      {renderProjectIcon(item.icon, 28)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-lg font-outfit font-bold text-white tracking-tight">
                          {item.title}
                        </h3>
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            <Star size={11} className="fill-amber-300 text-amber-300" />
                            Featured
                          </span>
                        )}
                        {item.image && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            <ImageIcon size={11} />
                            Has Image
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-white/70 line-clamp-2 max-w-2xl leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tech?.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-white/5 text-white/80 border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SKILLS ITEM */}
                {activeTab === "skills" && (
                  <div className="flex items-start gap-5 flex-grow">
                    <div
                      className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 text-white flex items-center justify-center`}
                    >
                      {renderSkillIcon(item.icon, 28)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-outfit font-bold text-white tracking-tight">
                          {item.category}
                        </h3>
                        <span className="text-xs font-mono text-white/40">
                          ({item.skills?.length || 0} skills)
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-white/50 font-mono tracking-wider uppercase">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.skills?.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 text-white/90 border border-white/10"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* EXPERIENCE ITEM */}
                {activeTab === "experience" && (
                  <div className="flex items-start gap-5 flex-grow">
                    <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 shrink-0 text-blue-400">
                      <Briefcase size={28} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-lg font-outfit font-bold text-white tracking-tight">
                          {item.role}
                        </h3>
                        <span className="text-xs font-mono text-white/80 bg-white/10 border border-white/10 px-3 py-0.5 rounded-full">
                          {item.date}
                        </span>
                      </div>

                      <p className="text-sm text-white/80 flex items-center gap-2">
                        <MapPin size={14} className="text-white/50" />
                        {item.company}
                      </p>

                      <ul className="space-y-1.5 pt-2 max-w-2xl">
                        {item.points?.slice(0, 2).map((pt, i) => (
                          <li key={i} className="text-xs text-white/70 line-clamp-2 flex items-start gap-2">
                            <span className="text-white/40">▹</span>
                            {pt}
                          </li>
                        ))}
                        {item.points?.length > 2 && (
                          <li className="text-[11px] font-mono text-white/40 italic">
                            + {item.points.length - 2} more bullet points
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* CERTIFICATIONS ITEM */}
                {activeTab === "certifications" && (
                  <div className="flex items-start gap-5 flex-grow">
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shrink-0 text-amber-400">
                      <Award size={28} />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-outfit font-bold text-white tracking-tight">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                        {item.issuer && <span>Issuer: {item.issuer}</span>}
                        {item.date && <span>Issued: {item.date}</span>}
                        {item.credentialUrl && (
                          <a
                            href={
                              item.credentialUrl.startsWith("http")
                                ? item.credentialUrl
                                : `https://${item.credentialUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                          >
                            <ExternalLink size={12} />
                            Verify Credential
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Section: Ordering & Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  {/* Order Controls */}
                  <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
                    <button
                      onClick={() => handleMoveOrder(index, -1)}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1.5 text-white/50 hover:text-white disabled:opacity-20 disabled:hover:text-white/50 transition-colors"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 1)}
                      disabled={index === displayList.length - 1}
                      title="Move Down"
                      className="p-1.5 text-white/50 hover:text-white disabled:opacity-20 disabled:hover:text-white/50 transition-colors"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  {/* Featured Toggle (Projects only) */}
                  {activeTab === "projects" && (
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      title={item.featured ? "Remove from Featured" : "Mark as Featured"}
                      className={`p-2.5 rounded-xl border transition-all ${
                        item.featured
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25"
                          : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Star size={16} className={item.featured ? "fill-amber-300" : ""} />
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Item"
                    className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>

                  {/* Delete Button */}
                  {deleteConfirmId === item._id ? (
                    <div className="flex items-center gap-1.5 bg-red-500/20 p-1 rounded-xl border border-red-500/30">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2.5 py-1 text-xs font-mono bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(item._id)}
                      title="Delete Item"
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Global Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-4xl bg-[#0d0d0d] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-outfit font-bold text-white">
                      {editingItem ? "Edit" : "Add New"}{" "}
                      {activeTab === "projects"
                        ? "Project"
                        : activeTab === "skills"
                        ? "Skill Category"
                        : activeTab === "experience"
                        ? "Experience Role"
                        : "Certification"}
                    </h3>
                    <p className="text-xs text-white/50">Configure fields and save to MongoDB</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FORM PER ACTIVE TAB */}
              <form onSubmit={handleSave} className="space-y-5">
                {/* 1. PROJECTS FORM */}
                {activeTab === "projects" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. AI Workflow Generator"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Description *
                      </label>
                      <textarea
                        rows={3}
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Provide an overview of what the project does..."
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        required
                      />
                    </div>

                    {/* Tech Tags */}
                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Tech Stack
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag(tagInput);
                            }
                          }}
                          placeholder="Type tech and press Enter..."
                          className="flex-grow px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag(tagInput)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-mono text-white border border-white/10"
                        >
                          Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[30px] p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                        {projectForm.tech.map((t, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(t)}
                              className="text-blue-300/60 hover:text-blue-200"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-mono text-white/40 mr-1">Quick Add:</span>
                        {POPULAR_PROJECT_TAGS.filter((t) => !projectForm.tech.includes(t))
                          .slice(0, 8)
                          .map((suggested, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAddTag(suggested)}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5"
                            >
                              +{suggested}
                            </button>
                          ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          GitHub Repo URL
                        </label>
                        <input
                          type="url"
                          value={projectForm.github}
                          onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Live Demo URL
                        </label>
                        <input
                          type="text"
                          value={projectForm.live}
                          onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                          placeholder="https://yourproject.vercel.app"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Preview Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/... or hosted screenshot"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      />
                    </div>

                    {/* Icon & Theme */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Icon
                        </label>
                        <div className="grid grid-cols-6 gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-xl max-h-32 overflow-y-auto">
                          {AVAILABLE_ICONS.map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => setProjectForm({ ...projectForm, icon: item.name })}
                              className={`p-2 rounded-xl flex items-center justify-center ${
                                projectForm.icon === item.name
                                  ? "bg-blue-500 text-white"
                                  : "bg-white/5 text-white/50 hover:text-white"
                              }`}
                            >
                              <item.component size={18} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Color Theme
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {COLOR_THEMES.slice(0, 6).map((theme) => (
                            <button
                              key={theme.name}
                              type="button"
                              onClick={() =>
                                setProjectForm({
                                  ...projectForm,
                                  color: theme.color,
                                  bgAccent: theme.bgAccent,
                                })
                              }
                              className={`p-2 rounded-xl border text-left flex items-center gap-2 ${
                                projectForm.color === theme.color
                                  ? "border-white bg-white/10"
                                  : "border-white/5 bg-white/5"
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${theme.previewClass}`} />
                              <span className="text-xs font-mono truncate">{theme.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={projectForm.featured}
                        onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500"
                      />
                      <span className="text-xs font-mono text-white/90">Featured / Pin to top</span>
                    </label>
                  </div>
                )}

                {/* 2. SKILLS FORM */}
                {activeTab === "skills" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={skillForm.category}
                        onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                        placeholder="e.g. Languages, Web & Backend, AI & ML, Tools"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={skillForm.description}
                        onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                        placeholder="e.g. Modern full-stack architecture & APIs"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      />
                    </div>

                    {/* Skill Chips */}
                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Skills in this Category
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag(tagInput);
                            }
                          }}
                          placeholder="Type skill name and press Enter..."
                          className="flex-grow px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTag(tagInput)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-mono text-white border border-white/10"
                        >
                          Add Skill
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2.5 min-h-[36px] p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                        {skillForm.skills.map((s, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 text-white border border-white/15"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(s)}
                              className="text-white/40 hover:text-white"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-mono text-white/40 mr-1">Quick Add:</span>
                        {POPULAR_SKILL_TAGS.filter((t) => !skillForm.skills.includes(t))
                          .slice(0, 10)
                          .map((suggested, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAddTag(suggested)}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5"
                            >
                              +{suggested}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Icon & Color */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Category Icon
                        </label>
                        <div className="grid grid-cols-6 gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-xl max-h-32 overflow-y-auto">
                          {AVAILABLE_ICONS.map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => setSkillForm({ ...skillForm, icon: item.name })}
                              className={`p-2 rounded-xl flex items-center justify-center ${
                                skillForm.icon === item.name
                                  ? "bg-blue-500 text-white"
                                  : "bg-white/5 text-white/50 hover:text-white"
                              }`}
                            >
                              <item.component size={18} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Accent Gradient Color
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {COLOR_THEMES.map((theme) => (
                            <button
                              key={theme.name}
                              type="button"
                              onClick={() => setSkillForm({ ...skillForm, color: theme.color })}
                              className={`p-2 rounded-xl border text-left flex items-center gap-2 ${
                                skillForm.color === theme.color
                                  ? "border-white bg-white/10"
                                  : "border-white/5 bg-white/5"
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${theme.previewClass}`} />
                              <span className="text-xs font-mono truncate">{theme.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. EXPERIENCE FORM */}
                {activeTab === "experience" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Job / Role Title *
                        </label>
                        <input
                          type="text"
                          value={experienceForm.role}
                          onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                          placeholder="e.g. Full Stack Developer Intern"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Company & Location *
                        </label>
                        <input
                          type="text"
                          value={experienceForm.company}
                          onChange={(e) =>
                            setExperienceForm({ ...experienceForm, company: e.target.value })
                          }
                          placeholder="e.g. RungtaTech, Bhilai"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Duration / Date *
                      </label>
                      <input
                        type="text"
                        value={experienceForm.date}
                        onChange={(e) => setExperienceForm({ ...experienceForm, date: e.target.value })}
                        placeholder="e.g. Jan 24 - Jan 25, or Jun 2024 - Present"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        required
                      />
                    </div>

                    {/* Bullet Points */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider">
                          Key Achievements & Responsibilities (Bullet Points)
                        </label>
                        <button
                          type="button"
                          onClick={handleAddPoint}
                          className="inline-flex items-center gap-1 text-xs font-mono text-blue-400 hover:text-blue-300"
                        >
                          <Plus size={14} /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {experienceForm.points.map((pt, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <span className="text-white/40 mt-2.5 text-xs font-mono">▹</span>
                            <textarea
                              rows={2}
                              value={pt}
                              onChange={(e) => handlePointChange(e.target.value, i)}
                              placeholder={`Highlight #${i + 1}...`}
                              className="flex-grow px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                            />
                            {experienceForm.points.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePoint(i)}
                                className="p-2 text-white/40 hover:text-red-400 mt-1 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CERTIFICATIONS FORM */}
                {activeTab === "certifications" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Certification Title *
                      </label>
                      <input
                        type="text"
                        value={certForm.title}
                        onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                        placeholder="e.g. IBM SkillBuild: Full Stack Development (MERN Specialization)"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Issuing Organization (Optional)
                        </label>
                        <input
                          type="text"
                          value={certForm.issuer}
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          placeholder="e.g. IBM, Postman, GitHub, AWS"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                          Issue Date / Year (Optional)
                        </label>
                        <input
                          type="text"
                          value={certForm.date}
                          onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                          placeholder="e.g. 2024"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Credential Verification Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={certForm.credentialUrl}
                        onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                        placeholder="https://www.credly.com/badges/... or verification URL"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      />
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-medium text-xs font-mono text-white shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : editingItem ? "Save Changes" : "Create Item"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
