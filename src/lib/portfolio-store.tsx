import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getSiteContent, saveSiteContent } from "@/lib/site-content.functions";
import {
  achievements as defaultAchievements,
  education as defaultEducation,
  experience as defaultExperience,
  marqueeSkills as defaultMarquee,
  profile as defaultProfile,
  projects as defaultProjects,
  skillGroups as defaultSkillGroups,
  stats as defaultStats,
} from "@/lib/portfolio-data";

export type Project = {
  name: string;
  kind: string;
  summary: string;
  points: string[];
  stack: string[];
};

export type SkillGroup = { title: string; note: string; items: string[] };
export type Experience = { role: string; org: string; period: string; points: string[] };
export type Education = { degree: string; school: string; period: string };
export type Stat = { value: string; label: string };
export type Profile = typeof defaultProfile;

export type Content = {
  profile: Profile;
  stats: Stat[];
  skillGroups: SkillGroup[];
  marqueeSkills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  achievements: string[];
};

export const defaultContent: Content = {
  profile: defaultProfile,
  stats: defaultStats,
  skillGroups: defaultSkillGroups,
  marqueeSkills: defaultMarquee,
  projects: defaultProjects,
  experience: defaultExperience,
  education: defaultEducation,
  achievements: defaultAchievements,
};

const STORAGE_KEY = "portfolio-content-v1";
const THEME_KEY = "portfolio-theme-v1";
const MODE_KEY = "portfolio-mode-v1";

export const THEMES = [
  { id: "cyber", name: "Cyber Blue", note: "Neon blue on black", swatch: ["#0b0f1a", "#4f8bff", "#63d8f5"] },
  { id: "matrix", name: "Matrix Green", note: "Terminal green on black", swatch: ["#07120c", "#3ff08a", "#9cf25a"] },
  { id: "magenta", name: "Neon Magenta", note: "Synthwave pink / violet", swatch: ["#120a16", "#ff5ec8", "#a98bff"] },
  { id: "amber", name: "Solar Amber", note: "Warm HUD amber", swatch: ["#141008", "#ffb545", "#ff8a3d"] },
  { id: "ice", name: "Ice Cyan", note: "Cold arctic cyan", swatch: ["#0a1116", "#7fe9ef", "#bcd9ff"] },
  { id: "void", name: "Mono Void", note: "Pure black & white HUD", swatch: ["#050508", "#e8e8ef", "#7a6bff"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export type ModeId = "dark" | "light";

export type SyncState = "idle" | "saving" | "saved" | "error";

type Ctx = {
  content: Content;
  setContent: (updater: (prev: Content) => Content) => void;
  reset: () => void;
  setAdminCode: (code: string | null) => void;
  syncState: SyncState;
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  mode: ModeId;
  setMode: (id: ModeId) => void;
  toggleMode: () => void;
  adminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<Content>(defaultContent);
  const [adminOpen, setAdminOpen] = useState(false);
  const [theme, setThemeState] = useState<ThemeId>("cyber");
  const [mode, setModeState] = useState<ModeId>("dark");


  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY) as ThemeId | null;
    if (saved && THEMES.some((t) => t.id === saved)) setThemeState(saved);
    const savedMode = window.localStorage.getItem(MODE_KEY) as ModeId | null;
    if (savedMode === "light" || savedMode === "dark") setModeState(savedMode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "cyber") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-mode", mode);
    root.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const setMode = useCallback((id: ModeId) => {
    setModeState(id);
    try {
      window.localStorage.setItem(MODE_KEY, id);
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: ModeId = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(MODE_KEY, next);
      } catch {
        /* storage may be unavailable */
      }
      return next;
    });
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    try {
      window.localStorage.setItem(THEME_KEY, id);
    } catch {
      /* storage may be unavailable */
    }
  }, []);


  // Load the published content from the cloud so every visitor sees admin edits.
  useEffect(() => {
    getSiteContent()
      .then(({ content: remote }) => {
        if (remote) setContentState({ ...defaultContent, ...(remote as Partial<Content>) });
      })
      .catch(() => {});
  }, []);

  const adminCodeRef = useRef<string | null>(null);
  const saveTimer = useRef<number | null>(null);
  const [syncState, setSyncState] = useState<SyncState>("idle");

  const pushRemote = useCallback((next: Content | null) => {
    const code = adminCodeRef.current;
    if (!code) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    setSyncState("saving");
    saveTimer.current = window.setTimeout(() => {
      saveSiteContent({ data: { code, content: next as Record<string, unknown> | null } })
        .then(() => setSyncState("saved"))
        .catch(() => setSyncState("error"));
    }, 700);
  }, []);

  const setAdminCode = useCallback((code: string | null) => {
    adminCodeRef.current = code;
  }, []);

  const setContent = useCallback(
    (updater: (prev: Content) => Content) => {
      setContentState((prev) => {
        const next = updater(prev);
        pushRemote(next);
        return next;
      });
    },
    [pushRemote],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setContentState(defaultContent);
    pushRemote(null);
  }, [pushRemote]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      setAdminCode,
      syncState,
      reset,
      theme,
      setTheme,
      mode,
      setMode,
      toggleMode,
      adminOpen,
      openAdmin: () => setAdminOpen(true),
      closeAdmin: () => setAdminOpen(false),
    }),
    [content, setContent, setAdminCode, syncState, reset, theme, setTheme, mode, setMode, toggleMode, adminOpen],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContentStore() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContentStore must be used inside <ContentProvider>");
  return ctx;
}

export function useContent() {
  return useContentStore().content;
}
