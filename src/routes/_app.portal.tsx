import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  BookOpen, ClipboardCheck, FileText, Wallet, CalendarDays, Bell,
  TrendingUp, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Card, Badge, Kpi } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { students, assignments, exams, invoices, announcements } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/portal")({ component: StudentPortal });

function StudentPortal() {
  const navigate = useNavigate();
  const me = students[3];

  const todaysClasses = useMemo(() => [
    { time: "08:00", subject: "Mathematics", teacher: "Ms. Kapoor", room: "R-204", status: "Done" as const },
    { time: "09:00", subject: "English Literature", teacher: "Mr. Iyer", room: "R-108", status: "Done" as const },
    { time: "10:15", subject: "Physics - Lab", teacher: "Dr. Mehta", room: "Lab 3", status: "Now" as const },
    { time: "11:30", subject: "Computer Science", teacher: "Ms. Nair", room: "R-301", status: "Next" as const },
    { time: "13:00", subject: "History", teacher: "Mr. Das", room: "R-112", status: "Upcoming" as const },
    { time: "14:15", subject: "Physical Ed.", teacher: "Coach Rao", room: "Ground", status: "Upcoming" as const },
  ], []);

  const myAssignments = assignments.slice(0, 4);
  const myExams = exams.filter((e) => e.status === "Upcoming").slice(0, 3);
  const myInvoices = invoices.slice(0, 3);
  const news = announcements.filter((a) => a.audience === "All" || a.audience === "Students").slice(0, 3);

  const gradeTrend = [
    { m: "Jul", g: 74 }, { m: "Aug", g: 78 }, { m: "Sep", g: 81 },
    { m: "Oct", g: 79 }, { m: "Nov", g: 84 }, { m: "Dec", g: 86 },
  ];
  const attendancePct = 94;

  return (
    <div className="max-w-[1600px] space-y-6 px-6 py-6 lg:px-8 lg:py-8">
      <div className="relative overflow-hidden card-surface shadow-elegant">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(600px 200px at 15% 0%, oklch(0.62 0.18 278 / 0.28), transparent 60%), radial-gradient(500px 200px at 85% 100%, oklch(0.5 0.2 295 / 0.22), transparent 60%)",
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6 p-6 md:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.09em] text-primary">
              <Sparkles className="h-3 w-3" /> Student portal
            </div>
            <h1 className="mt-2 text-[26px] font-semibold tracking-tight">
              Good morning, {me.name.split(" ")[0]}.
            </h1>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              {me.grade} - Section {me.section} - Admission {me.admissionNo}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => navigate({ to: "/assignments" })}>
                View assignments <ArrowUpRight />
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate({ to: "/timetable" })}>
                Timetable
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate({ to: "/fees" })}>
                Pay fees
              </Button>
            </div>
          </div>
          <div className="w-full max-w-[220px]">
            <div className="mb-1 text-[11px] uppercase tracking-[0.09em] text-muted-foreground/80">Attendance</div>
            <div className="h-36">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: attendancePct }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="v" cornerRadius={12} fill="oklch(0.72 0.16 158)" background={{ fill: "oklch(1 0 0 / 0.06)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-24 text-center">
              <div className="text-[26px] font-semibold tabular-nums">{attendancePct}%</div>
              <div className="text-[11px] text-muted-foreground">This term</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="Average grade" value="84%" hint="+3.2% this month" tone="primary" />
        <Kpi label="Assignments due" value={myAssignments.filter((a) => a.status === "Open").length.toString()} hint="Next: 3 Nov" tone="warning" />
        <Kpi label="Upcoming exams" value={myExams.length.toString()} hint="Starting 12 Nov" tone="info" />
        <Kpi label="Fees due" value={`Rs${myInvoices.filter((i) => i.status !== "Paid").reduce((a, b) => a + b.amount, 0).toLocaleString()}`} hint="2 invoices pending" tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-3">
            <div>
              <div className="text-[13px] font-medium">Today's schedule</div>
              <div className="text-[11.5px] text-muted-foreground">Tuesday, 7 July 2026</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/timetable" })}>Full timetable</Button>
          </div>
          <ul className="divide-y divide-border">
            {todaysClasses.map((c, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-2/60">
                <div className="w-14 text-[12px] tabular-nums text-muted-foreground">{c.time}</div>
                <div className={`h-8 w-1 rounded-full ${c.status === "Now" ? "bg-primary" : c.status === "Done" ? "bg-success/50" : "bg-border"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium">{c.subject}</div>
                  <div className="text-[11.5px] text-muted-foreground">{c.teacher} - {c.room}</div>
                </div>
                {c.status === "Now" && <Badge tone="primary"><Clock className="h-3 w-3" /> In session</Badge>}
                {c.status === "Next" && <Badge tone="info">Next</Badge>}
                {c.status === "Done" && <Badge tone="muted"><CheckCircle2 className="h-3 w-3" /> Done</Badge>}
                {c.status === "Upcoming" && <Badge tone="muted">Upcoming</Badge>}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div>
              <div className="text-[13px] font-medium">Grade trend</div>
              <div className="text-[11.5px] text-muted-foreground">Overall average</div>
            </div>
            <Badge tone="success"><TrendingUp className="h-3 w-3" /> +12%</Badge>
          </div>
          <div className="h-52 px-2 pb-3">
            <ResponsiveContainer>
              <AreaChart data={gradeTrend}>
                <defs>
                  <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.16 158)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.72 0.16 158)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="m" tick={{ fill: "oklch(0.65 0.014 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fill: "oklch(0.65 0.014 265)", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: "oklch(0.165 0.012 265)", border: "1px solid oklch(1 0 0 / 0.06)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="g" stroke="oklch(0.72 0.16 158)" strokeWidth={2} fill="url(#gt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-3">
            <div className="text-[13px] font-medium">Assignments</div>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/assignments" })}>View all</Button>
          </div>
          <ul className="divide-y divide-border">
            {myAssignments.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-2/60">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-surface-2 ring-1 ring-border">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">{a.title}</div>
                  <div className="text-[11.5px] text-muted-foreground">{a.subject} - {a.assignedBy}</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] text-muted-foreground">Due</div>
                  <div className="text-[12.5px] font-medium tabular-nums">{a.dueDate}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Opened "${a.title}"`)}>Open</Button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-3">
            <div className="flex items-center gap-1.5 text-[13px] font-medium"><Bell className="h-3.5 w-3.5" /> Announcements</div>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/announcements" })}>All</Button>
          </div>
          <ul className="divide-y divide-border">
            {news.map((n) => (
              <li key={n.id} className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <Badge tone={n.priority === "Urgent" ? "danger" : n.priority === "Important" ? "warning" : "muted"}>{n.priority}</Badge>
                  <div className="text-[11px] text-muted-foreground">{n.publishedAt}</div>
                </div>
                <div className="mt-1.5 text-[13px] font-medium">{n.title}</div>
                <div className="mt-0.5 line-clamp-2 text-[11.5px] text-muted-foreground">{n.body}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-3">
            <div className="text-[13px] font-medium">Upcoming exams</div>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/examinations" })}>Datesheet</Button>
          </div>
          <div className="grid grid-cols-1 divide-border gap-0 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            {myExams.map((e) => (
              <div key={e.id} className="p-5">
                <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{e.subject}</div>
                <div className="mt-1 text-[14px] font-semibold">{e.name}</div>
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> {e.date} - {e.duration}
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground">{e.totalMarks} marks</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-3">
            <div className="flex items-center gap-1.5 text-[13px] font-medium"><Wallet className="h-3.5 w-3.5" /> Fees</div>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/fees" })}>Manage</Button>
          </div>
          <ul className="divide-y divide-border">
            {myInvoices.map((i) => (
              <li key={i.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium">{i.category}</div>
                  <div className="text-[11.5px] text-muted-foreground">Due {i.dueDate}</div>
                </div>
                <div className="text-[13px] font-medium tabular-nums">Rs{i.amount.toLocaleString()}</div>
                <Badge tone={i.status === "Paid" ? "success" : i.status === "Pending" ? "warning" : "danger"}>{i.status}</Badge>
              </li>
            ))}
            <li className="px-5 py-3">
              <Button size="sm" className="w-full" onClick={() => toast.success("Redirecting to payment gateway...")}>Pay outstanding</Button>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
