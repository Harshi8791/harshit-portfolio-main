import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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

type Ctx = {
  content: Content;
  setContent: (updater: (prev: Content) => Content) => void;
  reset: () => void;
  adminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
};

const ContentContext = createContext<Ctx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<Content>(defaultContent);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setContentState({ ...defaultContent, ...(JSON.parse(raw) as Partial<Content>) });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const setContent = useCallback((updater: (prev: Content) => Content) => {
    setContentState((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage may be unavailable */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setContentState(defaultContent);
  }, []);

  const value = useMemo(
    () => ({
      content,
      setContent,
      reset,
      adminOpen,
      openAdmin: () => setAdminOpen(true),
      closeAdmin: () => setAdminOpen(false),
    }),
    [content, setContent, reset, adminOpen],
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
