import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Badge } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/calendar")({ component: CalendarPage });

type Ev = { day: number; title: string; tone: "primary" | "success" | "warning" | "danger" | "info" };

function CalendarPage() {
  const [month, setMonth] = useState(10); // Nov (0-indexed)
  const [year, setYear] = useState(2025);
  const [events, setEvents] = useState<Ev[]>([
    { day: 5, title: "PTM · Grade 6", tone: "info" },
    { day: 12, title: "Term 2 Exam start", tone: "warning" },
    { day: 15, title: "Sports Day", tone: "success" },
    { day: 20, title: "Cultural Fest", tone: "primary" },
    { day: 25, title: "Result Publishing", tone: "danger" },
    { day: 28, title: "Holiday · Guru Nanak Jayanti", tone: "info" },
  ]);
  const [dlg, setDlg] = useState<{ open: boolean; day?: number }>({ open: false });
  const [title, setTitle] = useState("");

  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const offset = first.getDay();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - offset + 1;
    return d >= 1 && d <= lastDay ? d : null;
  });
  const monthName = first.toLocaleString("en", { month: "long" });

  function nav(d: number) {
    const m = month + d;
    if (m < 0) { setMonth(11); setYear(year - 1); }
    else if (m > 11) { setMonth(0); setYear(year + 1); }
    else setMonth(m);
  }
  function add() {
    if (!title.trim() || !dlg.day) return;
    setEvents((es) => [...es, { day: dlg.day!, title, tone: "primary" }]);
    toast.success("Event added"); setDlg({ open: false }); setTitle("");
  }

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Overview" title="Calendar" subtitle="Academic calendar, events and holidays."
        actions={
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={() => nav(-1)}><ChevronLeft /></Button>
            <div className="min-w-[140px] text-center text-[13.5px] font-medium">{monthName} {year}</div>
            <Button size="icon" variant="outline" onClick={() => nav(1)}><ChevronRight /></Button>
          </div>
        } />
      <Card>
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const dayEvents = d ? events.filter((e) => e.day === d) : [];
            return (
              <div key={i} className={`min-h-[110px] p-2 border-b border-r border-border last:border-r-0 ${d ? "hover:bg-surface-2/40 cursor-pointer" : "bg-background/40"}`}
                onClick={() => d && setDlg({ open: true, day: d })}>
                {d && <div className="text-[12px] font-medium text-foreground mb-1.5">{d}</div>}
                <div className="space-y-1">
                  {dayEvents.map((e, j) => <Badge key={j} tone={e.tone}>{e.title}</Badge>)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Dialog open={dlg.open} onOpenChange={(o) => setDlg({ open: o })}>
        <DialogContent>
          <DialogHeader><DialogTitle>New event · {monthName} {dlg.day}</DialogTitle></DialogHeader>
          <div className="space-y-1.5"><Label className="text-[12px]">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setDlg({ open: false })}>Cancel</Button><Button onClick={add}><Plus /> Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
