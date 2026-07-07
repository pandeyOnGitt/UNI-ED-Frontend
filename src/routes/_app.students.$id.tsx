import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowLeft, Mail, Phone, MapPin, CalendarDays, GraduationCap, Wallet,
  ClipboardCheck, FileText, Download, MessageSquare, Edit3, MoreHorizontal,
  TrendingUp, BookOpen, Award, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, Badge, Avatar, Kpi } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { students, invoices, assignments, exams, SUBJECTS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/students/$id")({ component: StudentDetail });

function StudentDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === id);

  const studentInvoices = useMemo(
    () => (student ? invoices.filter((i) => i.student === student.name).slice(0, 6) : []),
    [student],
  );

  if (!student) {
    return (
      <div className="px-6 py-16 lg:px-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-3 text-lg font-semibold">Student not found</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">The student ID <code className="text-foreground">{id}</code> doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate({ to: "/students" })}><ArrowLeft /> Back to students</Button>
      </div>
    );
  }


  const studentAssignments = assignments.slice(0, 5);
  const upcomingExams = exams.filter((e) => e.status === "Upcoming").slice(0, 4);

  const attendanceData = [
    { m: "Jun", present: 92 }, { m: "Jul", present: 95 }, { m: "Aug", present: 88 },
    { m: "Sep", present: 96 }, { m: "Oct", present: 94 }, { m: "Nov", present: 97 },
  ];
  const subjectPerf = SUBJECTS.slice(0, 6).map((s, i) => ({
    subject: s.slice(0, 4), score: 68 + ((i * 7 + student.name.length * 3) % 28),
  }));

  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <div className="flex items-center gap-2 text-[12.5px]">
        <Link to="/students" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Students
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground">{student.name}</span>
      </div>

      {/* Identity header */}
      <Card>
        <div className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.5_0.2_295)] text-primary-foreground text-xl font-semibold ring-1 ring-border shadow-[0_1px_0_0_oklch(1_0_0_/_0.15)_inset]">
                {student.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-background ${student.status === "Active" ? "bg-success" : "bg-muted-foreground"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[22px] font-semibold tracking-tight">{student.name}</h1>
                <Badge tone={student.status === "Active" ? "success" : "muted"}>{student.status}</Badge>
                <Badge tone={student.feeStatus === "Paid" ? "success" : student.feeStatus === "Pending" ? "warning" : "danger"}>Fees · {student.feeStatus}</Badge>
              </div>
              <div className="mt-1.5 text-[13px] text-muted-foreground flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> {student.grade} · Section {student.section}</span>
                <span className="inline-flex items-center gap-1.5">Admission {student.admissionNo}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Joined Jun 2023</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Message thread opened")}><MessageSquare /> Message</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Report downloaded")}><Download /> Report</Button>
            <Button size="sm" onClick={() => toast.info("Edit dialog will open on Students list")}><Edit3 /> Edit</Button>
            <Button size="icon" variant="ghost" onClick={() => toast("More actions")}><MoreHorizontal /></Button>
          </div>
        </div>
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Attendance" value="94.2%" hint="Last 30 days" tone="success" />
        <Kpi label="Average score" value="82%" hint="+4.1% from last term" tone="primary" />
        <Kpi label="Rank" value="#12" hint={`of ${34} in ${student.section}`} tone="info" />
        <Kpi label="Outstanding" value={`₹${studentInvoices.filter(i => i.status !== "Paid").reduce((a, b) => a + b.amount, 0).toLocaleString()}`} hint={`${studentInvoices.filter(i => i.status !== "Paid").length} pending invoices`} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div>
                <div className="text-[13px] font-medium">Attendance trend</div>
                <div className="text-[11.5px] text-muted-foreground">Monthly % present</div>
              </div>
              <Badge tone="success"><TrendingUp className="h-3 w-3" /> +2.1%</Badge>
            </div>
            <div className="h-56 px-2 pb-3">
              <ResponsiveContainer>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="atn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.18 278)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.62 0.18 278)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                  <XAxis dataKey="m" tick={{ fill: "oklch(0.65 0.014 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fill: "oklch(0.65 0.014 265)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "oklch(0.165 0.012 265)", border: "1px solid oklch(1 0 0 / 0.06)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="present" stroke="oklch(0.62 0.18 278)" strokeWidth={2} fill="url(#atn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div>
                <div className="text-[13px] font-medium">Subject performance</div>
                <div className="text-[11.5px] text-muted-foreground">Term 2 · scores out of 100</div>
              </div>
            </div>
            <div className="h-56 px-2 pb-3">
              <ResponsiveContainer>
                <BarChart data={subjectPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                  <XAxis dataKey="subject" tick={{ fill: "oklch(0.65 0.014 265)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.65 0.014 265)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: "oklch(0.165 0.012 265)", border: "1px solid oklch(1 0 0 / 0.06)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="score" fill="oklch(0.72 0.13 235)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
              <div className="text-[13px] font-medium">Recent assignments</div>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/assignments" })}>View all</Button>
            </div>
            <ul className="divide-y divide-border">
              {studentAssignments.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-2/60 transition-colors">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 ring-1 ring-border">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">{a.title}</div>
                    <div className="text-[11.5px] text-muted-foreground">{a.subject} · Due {a.dueDate}</div>
                  </div>
                  <Badge tone={a.status === "Open" ? "info" : a.status === "Grading" ? "warning" : "muted"}>{a.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
              <div className="text-[13px] font-medium">Fee history</div>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/fees" })}>Open fees</Button>
            </div>
            <ul className="divide-y divide-border">
              {studentInvoices.length === 0 && (
                <li className="px-5 py-8 text-center text-[12.5px] text-muted-foreground">No invoices on record.</li>
              )}
              {studentInvoices.map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 ring-1 ring-border">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium">{i.category} · {i.id.toUpperCase()}</div>
                    <div className="text-[11.5px] text-muted-foreground">Due {i.dueDate}</div>
                  </div>
                  <div className="text-[13px] tabular-nums font-medium">₹{i.amount.toLocaleString()}</div>
                  <Badge tone={i.status === "Paid" ? "success" : i.status === "Pending" ? "warning" : "danger"}>{i.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right: contact + upcoming */}
        <div className="space-y-4">
          <Card>
            <div className="px-5 pt-4 pb-3 border-b border-border text-[13px] font-medium">Contact</div>
            <dl className="p-5 space-y-3 text-[13px]">
              <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={student.email} />
              <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={student.phone} />
              <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address" value="14, Palm Grove, Andheri West, Mumbai 400058" />
            </dl>
          </Card>

          <Card>
            <div className="px-5 pt-4 pb-3 border-b border-border text-[13px] font-medium">Guardian</div>
            <div className="p-5 flex items-center gap-3">
              <Avatar name={student.guardian} className="h-10 w-10 text-[13px]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{student.guardian}</div>
                <div className="text-[11.5px] text-muted-foreground">Primary contact</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Call initiated")}><Phone /></Button>
            </div>
          </Card>

          <Card>
            <div className="px-5 pt-4 pb-3 border-b border-border flex items-center justify-between">
              <div className="text-[13px] font-medium">Upcoming exams</div>
              <Badge tone="info">{upcomingExams.length}</Badge>
            </div>
            <ul className="divide-y divide-border">
              {upcomingExams.map((e) => (
                <li key={e.id} className="px-5 py-3">
                  <div className="text-[13px] font-medium">{e.name} · {e.subject}</div>
                  <div className="mt-0.5 text-[11.5px] text-muted-foreground">{e.date} · {e.duration} · {e.totalMarks} marks</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="px-5 pt-4 pb-3 border-b border-border text-[13px] font-medium">Achievements</div>
            <ul className="p-5 space-y-3">
              {[
                { icon: Award, t: "Science Olympiad · Silver", d: "State level · Sep 2025" },
                { icon: BookOpen, t: "Reader of the month", d: "Library · Aug 2025" },
                { icon: ClipboardCheck, t: "100% attendance", d: "Term 1 · 2025" },
              ].map((a, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-surface-2 ring-1 ring-border">
                    <a.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium">{a.t}</div>
                    <div className="text-[11px] text-muted-foreground">{a.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1">
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="text-[13px] text-foreground truncate">{value}</dd>
      </div>
    </div>
  );
}
