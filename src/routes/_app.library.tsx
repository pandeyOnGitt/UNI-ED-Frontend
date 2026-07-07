import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, DataTable, Badge, Kpi } from "@/components/app/ui";
import { books as seed, type Book } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/library")({ component: LibraryPage });

function LibraryPage() {
  const [rows, setRows] = useState<Book[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", category: "Fiction", copies: 5 });

  const filtered = useMemo(() => rows.filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase())), [rows, search]);

  function issue(b: Book) {
    if (b.available <= 0) return toast.error("No copies available");
    setRows((rs) => rs.map((r) => r.id === b.id ? { ...r, available: r.available - 1, status: r.available - 1 === 0 ? "Out" : r.available - 1 < 3 ? "Low" : "Available" } : r));
    toast.success(`Issued: ${b.title}`);
  }
  function ret(b: Book) {
    if (b.available >= b.copies) return toast.error("All copies already returned");
    setRows((rs) => rs.map((r) => r.id === b.id ? { ...r, available: r.available + 1, status: r.available + 1 < 3 ? "Low" : "Available" } : r));
    toast.success(`Returned: ${b.title}`);
  }
  function add() {
    if (!form.title.trim()) return toast.error("Title required");
    setRows((rs) => [{ id: `bok_${Date.now()}`, ...form, available: form.copies, status: "Available" }, ...rs]);
    toast.success("Book added"); setDlg(false);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Operations" title="Library" subtitle="Catalog, issues and returns."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> Add book</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Titles" value={rows.length.toString()} tone="primary" />
        <Kpi label="Total copies" value={rows.reduce((a,b) => a+b.copies, 0).toString()} tone="info" />
        <Kpi label="Available" value={rows.reduce((a,b) => a+b.available, 0).toString()} tone="success" />
        <Kpi label="Out of stock" value={rows.filter(r=>r.status==="Out").length.toString()} tone="danger" />
      </div>
      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search title or author…" />
        <DataTable rows={filtered} rowKey={(r) => r.id}
          columns={[
            { key: "t", label: "Book", render: (r) => (
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 ring-1 ring-border"><BookOpen className="h-4 w-4 text-muted-foreground" /></span>
                <div><div className="font-medium">{r.title}</div><div className="text-[11px] text-muted-foreground">{r.author} · {r.category}</div></div>
              </div>
            )},
            { key: "i", label: "ISBN", render: (r) => <span className="text-muted-foreground font-mono text-[11.5px]">{r.isbn}</span> },
            { key: "c", label: "Copies", render: (r) => <span className="text-muted-foreground tabular-nums">{r.available} / {r.copies}</span> },
            { key: "s", label: "Status", render: (r) => <Badge tone={r.status === "Available" ? "success" : r.status === "Low" ? "warning" : "danger"}>{r.status}</Badge> },
            { key: "a", label: "", className: "text-right", render: (r) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="outline" onClick={() => issue(r)}>Issue</Button>
                <Button size="sm" variant="ghost" onClick={() => ret(r)}>Return</Button>
              </div>
            )},
          ]} />
      </Card>
      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add book</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Title" full><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></F>
            <F label="Author"><Input value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} /></F>
            <F label="ISBN"><Input value={form.isbn} onChange={(e) => setForm({...form, isbn: e.target.value})} /></F>
            <F label="Category"><Input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} /></F>
            <F label="Copies"><Input type="number" value={form.copies} onChange={(e) => setForm({...form, copies: Number(e.target.value)})} /></F>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button><Button onClick={add}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`space-y-1.5 ${full ? "col-span-2" : ""}`}><Label className="text-[12px]">{label}</Label>{children}</div>;
}
