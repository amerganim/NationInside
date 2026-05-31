import { FileText, Download, Trash2 } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { deleteDocument } from "@/lib/documents/actions";
import { Panel } from "@/components/ui";
import DocumentUploadForm from "@/components/app/DocumentUploadForm";
import { getT } from "@/lib/i18n/server";
import type { DocumentRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const { profile } = await getSession();
  const admin = isAdmin(profile);
  const t = await getT();

  const supabase = await createClient();
  const { data: docs } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
  const list = (docs ?? []) as DocumentRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{t("documents.title")}</h1>
          <p className="text-muted mt-1">{t("documents.subtitle")}</p>
        </div>
        {admin && <DocumentUploadForm />}
      </div>

      {list.length === 0 ? (
        <Panel><p className="text-sm text-muted py-8 text-center">{t("documents.empty")}</p></Panel>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((d) => (
            <div key={d.id} className="panel p-5 flex items-start gap-4">
              <span className="w-11 h-11 rounded-xl grid place-items-center bg-white/5 text-[var(--accent)] shrink-0"><FileText size={20} /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{d.title}</h3>
                {d.description && <p className="text-sm text-muted mt-0.5 line-clamp-2">{d.description}</p>}
                <div className="flex items-center gap-3 mt-3">
                  <a href={d.file_url} target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline">
                    <Download size={15} /> {t("common.download")}
                  </a>
                  <span className="text-xs text-muted">{new Date(d.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {admin && (
                <form action={deleteDocument}>
                  <input type="hidden" name="document_id" value={d.id} />
                  <button className="text-muted hover:text-[var(--danger)] p-1.5" title="Delete"><Trash2 size={15} /></button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
