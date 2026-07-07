import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Users, BookOpen, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Toolbar, Avatar, Kpi, Badge } from "@/components/app/ui";
import { classes as seed, GRADES, SECTIONS, SUBJECTS, type ClassRoom } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/classes")({ component: ClassesPage });

function ClassesPage() {
  const [rows, setRows] = useState<ClassRoom[]>(seed);
  const [search, setSearch] = useState("");
  const [dlg, setDlg] = useState(false);
  const [form, setForm] = useState({ name: GRADES[0], section: "A", teacher: "", subject: SUBJECTS[0], room: "" });

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase();
    return !q || `${r.name} ${r.section}`.toLowerCase().includes(q) || r.teacher.toLowerCase().includes(q);
  }), [rows, search]);

  function add() {
    if (!form.teacher.trim()) return toast.error("Class teacher required");
    setRows((rs) => [{ id: `cls_${Date.now()}`, ...form, strength: 30 }, ...rs]);
    toast.success(`${form.name} ${form.section} created`);
    setDlg(false);
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader
        eyebrow="Academics"
        title="Classes"
        subtitle="All class sections with their homeroom teacher and strength."
        actions={<Button size="sm" onClick={() => setDlg(true)}><Plus /> Add class</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Total classes" value={rows.length.toString()} tone="primary" />
        <Kpi label="Total students" value={rows.reduce((a,b) => a + b.strength, 0).toString()} tone="info" />
        <Kpi label="Avg. strength" value={Math.round(rows.reduce((a,b) => a + b.strength, 0) / rows.length).toString()} tone="muted" />
        <Kpi label="Sections" value={new Set(rows.map(r => r.section)).size.toString()} tone="success" />
      </div>

      <Card>
        <Toolbar search={search} onSearch={setSearch} placeholder="Search by grade or teacher…" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-surface p-4 hover:bg-surface-2 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{c.room}</div>
                  <div className="mt-0.5 text-[15px] font-semibold text-foreground">{c.name} · {c.section}</div>
                </div>
                <Badge tone="primary">{c.subject}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Avatar name={c.teacher} className="h-6 w-6 text-[10px]" />
                <span className="text-[12px] text-muted-foreground">{c.teacher}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[12px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.strength} students</span>
                <Link to="/attendance" className="text-primary hover:brightness-125 inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Open</Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={dlg} onOpenChange={setDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add class</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <F label="Grade">
              <Select value={form.name} onValueChange={(v) => setForm({...form, name: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Section">
              <Select value={form.section} onValueChange={(v) => setForm({...form, section: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Class teacher"><Input value={form.teacher} onChange={(e) => setForm({...form, teacher: e.target.value})} /></F>
            <F label="Room"><Input value={form.room} onChange={(e) => setForm({...form, room: e.target.value})} placeholder="R-201" /></F>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button>
            <Button onClick={add}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-[12px]">{label}</Label>{children}</div>;
}
