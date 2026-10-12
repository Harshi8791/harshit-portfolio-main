import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const ROW_ID = "main";

function checkCode(code: string) {
  const expected = (process.env["ADMIN_PASSCODE"] || "harshit").trim().toLowerCase();
  return code.trim().toLowerCase() === expected;
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const client = createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data } = await client.from("site_content").select("content").eq("id", ROW_ID).maybeSingle();
  return { json: data?.content ? JSON.stringify(data.content) : null };
});

export const verifyAdminCode = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ code: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => ({ ok: checkCode(data.code) }));

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ code: z.string().max(200), json: z.string().max(500000).nullable() }).parse(d),
  )
  .handler(async ({ data }) => {
    if (!checkCode(data.code)) throw new Error("Access denied");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.json === null) {
      await supabaseAdmin.from("site_content").delete().eq("id", ROW_ID);
      return { ok: true };
    }
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: ROW_ID, content: JSON.parse(data.json), updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
