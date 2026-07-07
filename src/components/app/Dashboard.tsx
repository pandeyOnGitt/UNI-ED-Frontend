import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Clock3,
  Download,
  FileText,
  MoreHorizontal,
  Users,
  Wallet,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

const attendance = [
  { d: "Mon", v: 92 },
  { d: "Tue", v: 94 },
  { d: "Wed", v: 91 },
  { d: "Thu", v: 95 },
  { d: "Fri", v: 93 },
  { d: "Sat", v: 88 },
];

const revenue = [
  { m: "Apr", v: 32 },
  { m: "May", v: 41 },
  { m: "Jun", v: 38 },
  { m: "Jul", v: 55 },
  { m: "Aug", v: 62 },
  { m: "Sep", v: 58 },
  { m: "Oct", v: 71 },
  { m: "Nov", v: 68 },
];

const gender = [
  { name: "Girls", value: 1218, color: "oklch(0.62 0.18 278)" },
  { name: "Boys", value: 1263, color: "oklch(0.72 0.13 235)" },
];

export function Dashboard() {
  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      {/* Page header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[12px] text-muted-foreground">Wednesday, 12 November 2025</div>
          <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-foreground">
            Good morning, Aditya
          </h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Here's what's happening at Scholaris Academy today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SegBtn active>Overview</SegBtn>
          <SegBtn>Academic</SegBtn>
          <SegBtn>Financial</SegBtn>
          <button className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12.5px] font-medium text-foreground hover:bg-surface-2 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi
          icon={GraduationCap}
          label="Total Students"
          value="2,481"
          delta="+3.2%"
          up
          sub="82 new this month"
        />
        <Kpi
          icon={ClipboardCheck}
          label="Today's Attendance"
          value="93.4%"
          delta="+1.1%"
          up
          sub="2,318 present · 163 absent"
        />
        <Kpi
          icon={Wallet}
          label="Pending Fees"
          value="₹4.2L"
          delta="-6.4%"
          up
          sub="128 invoices outstanding"
        />
        <Kpi
          icon={Users}
          label="Active Teachers"
          value="164"
          delta="+2"
          up
          sub="6 on leave today"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            eyebrow="Attendance"
            title="Weekly attendance rate"
            right={
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Legend color="oklch(0.62 0.18 278)" label="This week" />
                <Legend color="oklch(0.72 0.13 235)" label="Last week" />
              </div>
            }
          />
          <div className="h-64 px-2 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendance} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.18 278)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.62 0.18 278)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="d" stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip content={<ChartTip suffix="%" />} cursor={{ stroke: "oklch(1 0 0 / 0.08)" }} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="oklch(0.62 0.18 278)"
                  strokeWidth={2}
                  fill="url(#attGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader eyebrow="Enrollment" title="Gender distribution" />
          <div className="grid grid-cols-2 gap-4 px-5 pb-5">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gender}
                    innerRadius={40}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {gender.map((g) => (
                      <Cell key={g.name} fill={g.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {gender.map((g) => (
                <div key={g.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />
                    <span className="text-[12.5px] text-muted-foreground">{g.name}</span>
                  </div>
                  <div className="text-[13px] font-medium text-foreground tabular-nums">
                    {g.value.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="mt-1 pt-3 border-t border-border">
                <div className="text-[11px] text-muted-foreground">Total enrolled</div>
                <div className="text-[16px] font-semibold tabular-nums text-foreground">2,481</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            eyebrow="Fees"
            title="Fee collection · last 8 months"
            right={<Pill>₹ Lakhs</Pill>}
          />
          <div className="h-64 px-2 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue} margin={{ top: 10, right: 12, left: -20, bottom: 0 }} barCategoryGap={18}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTip prefix="₹" suffix="L" />} cursor={{ fill: "oklch(1 0 0 / 0.03)" }} />
                <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="oklch(0.62 0.18 278)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader eyebrow="Today" title="Schedule" right={<Pill>6 events</Pill>} />
          <ul className="px-5 pb-5 space-y-3">
            {[
              { t: "08:15", title: "Morning Assembly", meta: "Auditorium · All grades", tone: "primary" as const },
              { t: "09:30", title: "Grade 8 · Mathematics", meta: "Room 204 · Mr. Iyer", tone: "info" as const },
              { t: "11:00", title: "Parent–Teacher Meet", meta: "Grade 5 · Section B", tone: "warning" as const },
              { t: "14:00", title: "Staff Review", meta: "Conference Room 1", tone: "success" as const },
              { t: "16:30", title: "Inter-school Debate", meta: "Auditorium", tone: "danger" as const },
            ].map((e) => (
              <li key={e.title} className="flex items-start gap-3">
                <div className="w-12 shrink-0 pt-0.5 text-[11.5px] font-medium tabular-nums text-muted-foreground">
                  {e.t}
                </div>
                <div className="mt-1.5">
                  <span
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: `var(--color-${e.tone})` }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-foreground truncate">{e.title}</div>
                  <div className="text-[11.5px] text-muted-foreground truncate">{e.meta}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Third row: activity + admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            eyebrow="Admissions"
            title="Recent applications"
            right={
              <button className="text-[12px] font-medium text-primary hover:brightness-125">
                View all
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <Th>Applicant</Th>
                  <Th>Grade</Th>
                  <Th>Applied</Th>
                  <Th>Stage</Th>
                  <Th className="text-right">Status</Th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {[
                  { n: "Aarav Mehta", g: "Grade 6", d: "2h ago", s: "Interview", st: "review" },
                  { n: "Zara Fernandes", g: "Grade 3", d: "5h ago", s: "Docs verified", st: "approved" },
                  { n: "Kabir Sethi", g: "Grade 9", d: "Yesterday", s: "Assessment", st: "review" },
                  { n: "Ira Kapoor", g: "Grade 1", d: "Yesterday", s: "Fee pending", st: "pending" },
                  { n: "Rohan Das", g: "Grade 11", d: "2d ago", s: "Rejected", st: "rejected" },
                ].map((r) => (
                  <tr key={r.n} className="border-t border-border hover:bg-surface-2/60 transition-colors">
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(0.28_0.02_278)] text-[11px] font-medium text-foreground ring-1 ring-border">
                          {r.n
                            .split(" ")
                            .map((s) => s[0])
                            .join("")}
                        </span>
                        <span className="font-medium">{r.n}</span>
                      </div>
                    </Td>
                    <Td className="text-muted-foreground">{r.g}</Td>
                    <Td className="text-muted-foreground">{r.d}</Td>
                    <Td className="text-muted-foreground">{r.s}</Td>
                    <Td className="text-right">
                      <StatusBadge status={r.st as StatusKey} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader eyebrow="Activity" title="Latest updates" right={<MoreHorizontal className="h-4 w-4 text-muted-foreground" />} />
          <ol className="relative px-5 pb-5">
            <span className="absolute left-[26px] top-1 bottom-1 w-px bg-border" />
            {[
              { i: CheckCircle2, tone: "success", t: "Fee reminder batch sent", d: "128 parents · 2 min ago" },
              { i: FileText, tone: "info", t: "Term 2 marks published", d: "Grade 10 · 24 min ago" },
              { i: CalendarClock, tone: "warning", t: "Timetable updated", d: "Grade 7B · 1 hr ago" },
              { i: CircleDot, tone: "primary", t: "New admission approved", d: "Aarav Mehta · 3 hr ago" },
              { i: Clock3, tone: "muted", t: "Backup completed", d: "Nightly · 06:00" },
            ].map((a, i) => (
              <li key={i} className="relative pl-10 pb-4 last:pb-0">
                <span
                  className="absolute left-[18px] top-0.5 grid h-4 w-4 place-items-center rounded-full ring-4 ring-card"
                  style={{ background: `var(--color-${a.tone === "muted" ? "muted-foreground" : a.tone})` }}
                >
                  <a.i className="h-2.5 w-2.5 text-background" />
                </span>
                <div className="text-[13px] font-medium text-foreground">{a.t}</div>
                <div className="text-[11.5px] text-muted-foreground">{a.d}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Footer notes row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniCard label="Upcoming exams" value="Term 2 · in 12 days" hint="Grades 6–10 · 42 subjects" tone="warning" />
        <MiniCard label="Leave requests" value="7 pending" hint="4 teachers · 3 staff" tone="info" />
        <MiniCard label="System status" value="All systems operational" hint="Uptime 99.98% · 30d" tone="success" />
      </div>
    </div>
  );
}

/* ---------- primitives ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`card-surface shadow-elegant overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}

function CardHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
      <div>
        {eyebrow && (
          <div className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground/80">
            {eyebrow}
          </div>
        )}
        <div className="mt-0.5 text-[14.5px] font-semibold text-foreground">{title}</div>
      </div>
      {right}
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  up,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  up?: boolean;
  sub: string;
}) {
  return (
    <div className="card-surface shadow-elegant px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-muted-foreground">{label}</div>
        <span className="grid h-7 w-7 place-items-center rounded-md bg-surface-2 text-muted-foreground ring-1 ring-border">
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-[26px] font-semibold tracking-tight text-foreground tabular-nums">{value}</div>
        <span
          className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ${
            up
              ? "text-success ring-[oklch(0.72_0.16_158_/_0.25)] bg-[oklch(0.72_0.16_158_/_0.08)]"
              : "text-danger ring-[oklch(0.66_0.22_20_/_0.25)] bg-[oklch(0.66_0.22_20_/_0.08)]"
          }`}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <div className="mt-1 text-[11.5px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function SegBtn({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={[
        "rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
        active
          ? "bg-surface-2 text-foreground ring-1 ring-border"
          : "text-muted-foreground hover:text-foreground hover:bg-surface-2/70",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border">
      {children}
    </span>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-2.5 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 ${className}`}>{children}</td>;
}

type StatusKey = "approved" | "review" | "pending" | "rejected";
function StatusBadge({ status }: { status: StatusKey }) {
  const map: Record<StatusKey, { label: string; cls: string }> = {
    approved: {
      label: "Approved",
      cls: "text-success ring-[oklch(0.72_0.16_158_/_0.25)] bg-[oklch(0.72_0.16_158_/_0.08)]",
    },
    review: {
      label: "In review",
      cls: "text-info ring-[oklch(0.72_0.13_235_/_0.25)] bg-[oklch(0.72_0.13_235_/_0.08)]",
    },
    pending: {
      label: "Pending",
      cls: "text-warning ring-[oklch(0.78_0.15_78_/_0.25)] bg-[oklch(0.78_0.15_78_/_0.08)]",
    },
    rejected: {
      label: "Rejected",
      cls: "text-danger ring-[oklch(0.66_0.22_20_/_0.25)] bg-[oklch(0.66_0.22_20_/_0.08)]",
    },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${s.cls}`}>
      {s.label}
    </span>
  );
}

function MiniCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "warning" | "info" | "success";
}) {
  return (
    <div className="card-surface shadow-elegant px-5 py-4 flex items-center gap-4">
      <span
        className="h-9 w-9 shrink-0 rounded-lg ring-1 ring-border grid place-items-center"
        style={{ background: `color-mix(in oklab, var(--color-${tone}) 12%, transparent)` }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: `var(--color-${tone})` }} />
      </span>
      <div className="min-w-0">
        <div className="text-[11.5px] text-muted-foreground">{label}</div>
        <div className="text-[14px] font-semibold text-foreground truncate">{value}</div>
        <div className="text-[11.5px] text-muted-foreground truncate">{hint}</div>
      </div>
    </div>
  );
}

function ChartTip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-2.5 py-1.5 shadow-elegant">
      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-[12.5px] font-semibold text-foreground tabular-nums">
        {prefix}
        {payload[0].value}
        {suffix}
      </div>
    </div>
  );
}
