import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Kpi } from "@/components/app/ui";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/_app/analytics")({ component: AnalyticsPage });

const enrollment = [
  { m: "Apr", v: 2210 }, { m: "May", v: 2260 }, { m: "Jun", v: 2295 },
  { m: "Jul", v: 2330 }, { m: "Aug", v: 2384 }, { m: "Sep", v: 2418 },
  { m: "Oct", v: 2451 }, { m: "Nov", v: 2481 },
];
const perf = [
  { s: "Math", a: 78, b: 74 }, { s: "Sci", a: 82, b: 76 }, { s: "Eng", a: 85, b: 81 },
  { s: "SST", a: 76, b: 72 }, { s: "CS", a: 88, b: 84 }, { s: "PE", a: 92, b: 90 },
];
const attendance = [
  { d: "W1", v: 92 }, { d: "W2", v: 93 }, { d: "W3", v: 91 }, { d: "W4", v: 94 },
];
const dept = [
  { name: "Sciences", value: 32, color: "oklch(0.62 0.18 278)" },
  { name: "Humanities", value: 24, color: "oklch(0.72 0.13 235)" },
  { name: "Languages", value: 22, color: "oklch(0.72 0.16 158)" },
  { name: "Arts", value: 12, color: "oklch(0.78 0.15 78)" },
  { name: "Other", value: 10, color: "oklch(0.66 0.22 20)" },
];

function AnalyticsPage() {
  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-6 max-w-[1600px]">
      <PageHeader eyebrow="Insights" title="Analytics" subtitle="School-wide trends across enrollment, attendance, performance and finance." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Enrollment growth" value="+12.2%" hint="YoY" tone="success" />
        <Kpi label="Avg. attendance" value="93.4%" hint="Last 30d" tone="primary" />
        <Kpi label="Fee collection" value="87%" hint="Term 2 target" tone="info" />
        <Kpi label="Retention" value="96.1%" hint="Grades 6–10" tone="warning" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-5"><div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Enrollment</div><div className="text-[14.5px] font-semibold">Student growth · 8 months</div></div>
          <div className="h-64 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollment} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.62 0.18 278)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.62 0.18 278)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.013 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.62 0.18 278)" strokeWidth={2} fill="url(#ag)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="p-5"><div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Performance</div><div className="text-[14.5px] font-semibold">Subject averages · this term vs last</div></div>
          <div className="h-64 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perf} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="s" stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.013 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="a" radius={[4,4,0,0]} fill="oklch(0.62 0.18 278)" />
                <Bar dataKey="b" radius={[4,4,0,0]} fill="oklch(0.72 0.13 235)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="p-5"><div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Attendance</div><div className="text-[14.5px] font-semibold">Weekly attendance trend</div></div>
          <div className="h-56 px-2 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendance} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="d" stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.014 265)" fontSize={11} tickLine={false} axisLine={false} domain={[85, 100]} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.013 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.72 0.16 158)" strokeWidth={2} dot={{ r: 3, fill: "oklch(0.72 0.16 158)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="p-5"><div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Faculty mix</div><div className="text-[14.5px] font-semibold">Department distribution</div></div>
          <div className="grid grid-cols-2 gap-4 px-5 pb-5">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dept} innerRadius={45} outerRadius={72} paddingAngle={2} dataKey="value" stroke="none">
                    {dept.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-2">
              {dept.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[12.5px]">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} /><span className="text-muted-foreground">{d.name}</span></div>
                  <span className="text-foreground font-medium tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
