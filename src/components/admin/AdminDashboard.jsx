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
} from "lucide-react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  verifyAdminToken,
} from "../../utils/api";
import { AVAILABLE_ICONS, COLOR_THEMES, renderProjectIcon } from "../../utils/icons";

const POPULAR_TAGS = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "TailwindCSS",
  "Vite",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Docker",
  "Redis",
  "GSAP",
  "Framer Motion",
  "Swagger",
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAdmin, setActiveAdmin] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Form Fields
  const [formData, setFormData] = useState({
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

  const [techInput, setTechInput] = useState("");

  // Authenticate on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyAdminToken();
        if (res.success) {
          setActiveAdmin(res.admin);
          loadProjects();
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

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      if (res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
      showNotice("error", "Failed to fetch projects from server.");
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

  // Open modal for new project
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
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
    setTechInput("");
    setIsModalOpen(true);
  };

  // Open modal for editing existing project
  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || "",
      description: proj.description || "",
      tech: Array.isArray(proj.tech) ? proj.tech : [],
      github: proj.github || "",
      live: proj.live || "",
      image: proj.image || "",
      icon: proj.icon || "Activity",
      color: proj.color || "from-blue-400 to-cyan-600",
      bgAccent: proj.bgAccent || "bg-blue-500/10",
      featured: Boolean(proj.featured),
    });
    setTechInput("");
    setIsModalOpen(true);
  };

  // Tech stack tag helpers
  const handleAddTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.tech.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, trimmed],
      }));
    }
    setTechInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((t) => t !== tagToRemove),
    }));
  };

  // Handle Save
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showNotice("error", "Project Title and Description are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingProject) {
        // Update
        const res = await updateProject(editingProject._id, formData);
        if (res.success) {
          showNotice("success", "Project updated successfully!");
          setIsModalOpen(false);
          loadProjects();
        }
      } else {
        // Create
        const res = await createProject(formData);
        if (res.success) {
          showNotice("success", "Project added successfully!");
          setIsModalOpen(false);
          loadProjects();
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      showNotice("error", err.response?.data?.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Project
  const handleDelete = async (id) => {
    try {
      const res = await deleteProject(id);
      if (res.success) {
        showNotice("success", "Project deleted successfully.");
        setDeleteConfirmId(null);
        loadProjects();
      }
    } catch (err) {
      console.error("Delete error:", err);
      showNotice("error", "Failed to delete project.");
    }
  };

  // Reorder Projects (Move Up / Down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newOrder = [...projects];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setProjects(newOrder);

    try {
      const orderedIds = newOrder.map((p) => p._id);
      await reorderProjects(orderedIds);
      showNotice("success", "Project order updated!");
    } catch (err) {
      console.error("Reorder failed:", err);
      showNotice("error", "Failed to persist new order on server.");
      loadProjects();
    }
  };

  // Toggle Featured
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

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = p.title?.toLowerCase().includes(query);
    const descMatch = p.description?.toLowerCase().includes(query);
    const techMatch = p.tech?.some((t) => t.toLowerCase().includes(query));
    return titleMatch || descMatch || techMatch;
  });

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
                PROJECT MANAGER
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                  Admin
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
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 relative z-10">
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

        {/* Dashboard Stats & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div>
            <h2 className="text-3xl font-outfit font-black tracking-tight text-white mb-2">
              All Projects ({projects.length})
            </h2>
            <p className="text-sm text-white/60">
              Add new projects, update existing ones, upload previews, or drag to reorder.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadProjects}
              title="Refresh projects"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-medium text-sm text-white shadow-lg shadow-blue-500/25 transition-all group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Add New Project
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or technology..."
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

        {/* Projects List / Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/40">
            <div className="w-10 h-10 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-mono">Loading projects from MongoDB Atlas...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-white/5 bg-white/[0.02]">
            <Layers size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-bold font-outfit text-white mb-2">No Projects Found</h3>
            <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
              {searchQuery ? "No projects match your search query." : "You haven't added any projects yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors"
              >
                <Plus size={16} />
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id || index}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-[#0b0b0b] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left Section: Icon + Info */}
                <div className="flex items-start gap-5 flex-grow">
                  <div
                    className={`p-3.5 rounded-2xl ${project.bgAccent || "bg-blue-500/10"} border border-white/10 shrink-0 text-white flex items-center justify-center`}
                  >
                    {renderProjectIcon(project.icon, 28)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-outfit font-bold text-white tracking-tight">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Star size={11} className="fill-amber-300 text-amber-300" />
                          Featured
                        </span>
                      )}
                      {project.image && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          <ImageIcon size={11} />
                          Has Image
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-white/70 line-clamp-2 max-w-2xl leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tech?.map((t, idx) => (
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
                      disabled={index === filteredProjects.length - 1}
                      title="Move Down"
                      className="p-1.5 text-white/50 hover:text-white disabled:opacity-20 disabled:hover:text-white/50 transition-colors"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  {/* Featured Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    title={project.featured ? "Remove from Featured" : "Mark as Featured"}
                    className={`p-2.5 rounded-xl border transition-all ${
                      project.featured
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Star size={16} className={project.featured ? "fill-amber-300" : ""} />
                  </button>

                  {/* Links Preview */}
                  {project.live && (
                    <a
                      href={project.live.startsWith("http") ? project.live : `https://${project.live}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live Demo"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    title="Edit Project"
                    className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>

                  {/* Delete Button */}
                  {deleteConfirmId === project._id ? (
                    <div className="flex items-center gap-1.5 bg-red-500/20 p-1 rounded-xl border border-red-500/30">
                      <button
                        onClick={() => handleDelete(project._id)}
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
                      onClick={() => setDeleteConfirmId(project._id)}
                      title="Delete Project"
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

      {/* Add / Edit Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-5xl bg-[#0d0d0d] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-outfit font-bold text-white">
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </h3>
                    <p className="text-xs text-white/50">
                      Configure details, links, tech badges, and theme preview
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grid: Form on Left, Live Card Preview on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Form */}
                <form onSubmit={handleSaveProject} className="lg:col-span-7 space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. AI Workflow Generator"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide a compelling overview of what the project does and key engineering highlights..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      required
                    />
                  </div>

                  {/* Tech Stack Tags */}
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Technologies & Tools
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag(techInput);
                          }
                        }}
                        placeholder="Type technology and press enter..."
                        className="flex-grow px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag(techInput)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-mono text-white border border-white/10 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[30px] p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                      {formData.tech.length === 0 ? (
                        <span className="text-xs text-white/30 italic">No tags selected yet.</span>
                      ) : (
                        formData.tech.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-blue-300/60 hover:text-blue-200"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Quick Popular Suggestions */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono text-white/40 mr-1">Quick Add:</span>
                      {POPULAR_TAGS.filter((t) => !formData.tech.includes(t))
                        .slice(0, 8)
                        .map((suggested, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAddTag(suggested)}
                            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 transition-colors"
                          >
                            +{suggested}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Links: GitHub & Live Demo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        GitHub Repo URL
                      </label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/aadiityaasingh/..."
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                        Live Demo URL
                      </label>
                      <input
                        type="text"
                        value={formData.live}
                        onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                        placeholder="https://yourproject.vercel.app"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      />
                    </div>
                  </div>

                  {/* Preview Image / Screenshot URL */}
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Custom Preview Image / Screenshot URL (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://images.unsplash.com/... or hosted screenshot URL"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/70"
                      />
                    </div>
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Card Icon
                    </label>
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-xl max-h-36 overflow-y-auto">
                      {AVAILABLE_ICONS.map((item) => {
                        const Icon = item.component;
                        const isSelected = formData.icon === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: item.name })}
                            title={item.label}
                            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-blue-500 text-white shadow-md shadow-blue-500/30 scale-105"
                                : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <Icon size={20} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Theme Selector */}
                  <div>
                    <label className="block text-xs font-mono text-white/70 uppercase tracking-wider mb-2">
                      Gradient Color Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {COLOR_THEMES.map((theme) => {
                        const isSelected = formData.color === theme.color;
                        return (
                          <button
                            key={theme.name}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                color: theme.color,
                                bgAccent: theme.bgAccent,
                              })
                            }
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                              isSelected
                                ? "border-white bg-white/10 ring-1 ring-white"
                                : "border-white/5 bg-white/5 hover:bg-white/[0.08]"
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full ${theme.previewClass}`} />
                            <span className="text-xs font-mono text-white/80">{theme.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500 focus:ring-0 bg-white/5 border-white/20"
                      />
                      <span className="text-xs font-mono text-white/90">
                        Feature this project (Highlight with star)
                      </span>
                    </label>
                  </div>

                  {/* Submit / Cancel Buttons */}
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
                      {submitting ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
                    </button>
                  </div>
                </form>

                {/* Right: Live Interactive Card Preview */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div className="mb-3 flex items-center gap-2 text-xs font-mono text-white/50">
                    <Eye size={14} />
                    Live Portfolio Card Preview
                  </div>

                  {/* Card Mirroring the Portfolio's Exact Style */}
                  <div className="relative p-6 rounded-[2rem] bg-[#050505] border border-white/15 overflow-hidden flex flex-col h-[460px] shadow-2xl">
                    {/* Dynamic gradient bottom border */}
                    <div
                      className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${formData.color}`}
                    />

                    {/* Image Preview if provided */}
                    {formData.image && (
                      <div className="mb-4 rounded-xl overflow-hidden h-32 w-full bg-white/5 border border-white/10">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    )}

                    {/* Card Top: Icon & Links */}
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`p-3.5 rounded-2xl ${formData.bgAccent} border border-white/10 text-white`}
                      >
                        {renderProjectIcon(formData.icon, 32)}
                      </div>

                      <div className="flex gap-2">
                        {formData.github && (
                          <div className="p-2 rounded-full bg-white/5 text-white/70">
                            <Github size={16} />
                          </div>
                        )}
                        {formData.live && (
                          <div className="p-2 rounded-full bg-white/5 text-white/70">
                            <ExternalLink size={16} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-hidden">
                      <h4 className="text-xl font-outfit font-bold text-white mb-2 leading-tight">
                        {formData.title || "Project Title Preview"}
                      </h4>
                      <p className="text-white/70 text-xs leading-relaxed line-clamp-4">
                        {formData.description ||
                          "Project description preview will appear here as you type in the form..."}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                      {formData.tech.length > 0 ? (
                        formData.tech.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 text-white/90 border border-white/10"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] font-mono text-white/30">React, Node.js</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
