// Central mock data seeds used across modules.

export const GRADES = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
];

export const SECTIONS = ["A", "B", "C", "D"];

export const SUBJECTS = [
  "Mathematics", "English", "Science", "Social Studies",
  "Hindi", "Computer Science", "Physics", "Chemistry",
  "Biology", "Economics", "History", "Physical Ed.",
];

export const DEPARTMENTS = [
  "Mathematics", "Sciences", "Humanities", "Languages",
  "Computer Science", "Arts", "Physical Ed.", "Administration",
];

export type Student = {
  id: string;
  name: string;
  admissionNo: string;
  grade: string;
  section: string;
  gender: "Male" | "Female";
  guardian: string;
  phone: string;
  email: string;
  feeStatus: "Paid" | "Pending" | "Overdue";
  status: "Active" | "Inactive";
};

const firstNames = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Reyansh","Krishna","Ishaan","Rohan","Kabir","Ira","Zara","Anaya","Diya","Myra","Sara","Aisha","Riya","Kiara","Navya","Yash","Aryan","Kunal","Neel","Tara","Meera","Anika","Ishika","Rehan","Rudra"];
const lastNames = ["Mehta","Sharma","Iyer","Kapoor","Fernandes","Sethi","Kapadia","Das","Nair","Patel","Reddy","Rao","Bose","Chopra","Malhotra","Verma","Singh","Bhat","Kohli","Menon"];

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

let seed = 1;
function pseudoRand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function pick<T>(arr: T[]) {
  return arr[Math.floor(pseudoRand() * arr.length)];
}

export const students: Student[] = Array.from({ length: 42 }, (_, i) => {
  const first = pick(firstNames);
  const last = pick(lastNames);
  const gender: "Male" | "Female" = pseudoRand() > 0.5 ? "Male" : "Female";
  const feeR = pseudoRand();
  return {
    id: `stu_${1000 + i}`,
    name: `${first} ${last}`,
    admissionNo: `ADM${2025000 + i}`,
    grade: pick(GRADES),
    section: pick(SECTIONS),
    gender,
    guardian: `${pick(lastNames)} ${last}`,
    phone: `+91 9${Math.floor(100000000 + pseudoRand() * 800000000)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@scholaris.edu`,
    feeStatus: feeR > 0.7 ? "Overdue" : feeR > 0.4 ? "Pending" : "Paid",
    status: pseudoRand() > 0.05 ? "Active" : "Inactive",
  };
});

export type Teacher = {
  id: string;
  name: string;
  employeeNo: string;
  department: string;
  subjects: string[];
  email: string;
  phone: string;
  experience: number;
  status: "Active" | "On Leave" | "Inactive";
};

export const teachers: Teacher[] = Array.from({ length: 22 }, (_, i) => {
  const first = pick(firstNames);
  const last = pick(lastNames);
  return {
    id: `tch_${100 + i}`,
    name: `${first} ${last}`,
    employeeNo: `EMP${2020 + i}`,
    department: pick(DEPARTMENTS),
    subjects: [pick(SUBJECTS), pick(SUBJECTS)].filter((v, idx, a) => a.indexOf(v) === idx),
    email: `${first.toLowerCase()}.${last.toLowerCase()}@scholaris.edu`,
    phone: `+91 9${Math.floor(100000000 + pseudoRand() * 800000000)}`,
    experience: Math.floor(pseudoRand() * 20) + 1,
    status: pseudoRand() > 0.85 ? "On Leave" : "Active",
  };
});

export type Parent = {
  id: string;
  name: string;
  children: string[];
  phone: string;
  email: string;
  occupation: string;
};

export const parents: Parent[] = Array.from({ length: 28 }, (_, i) => {
  const first = pick(firstNames);
  const last = pick(lastNames);
  return {
    id: `par_${200 + i}`,
    name: `${first} ${last}`,
    children: [pick(students).name],
    phone: `+91 9${Math.floor(100000000 + pseudoRand() * 800000000)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
    occupation: pick(["Software Engineer","Doctor","Business Owner","Architect","Teacher","Banker","Consultant","Designer"]),
  };
});

export type Admission = {
  id: string;
  applicant: string;
  grade: string;
  appliedOn: string;
  stage: "Documents" | "Assessment" | "Interview" | "Fee" | "Enrolled" | "Rejected";
  status: "In Review" | "Approved" | "Pending" | "Rejected";
};

export const admissions: Admission[] = Array.from({ length: 14 }, (_, i) => ({
  id: `app_${300 + i}`,
  applicant: `${pick(firstNames)} ${pick(lastNames)}`,
  grade: pick(GRADES),
  appliedOn: `${Math.floor(pseudoRand() * 28) + 1} Oct 2025`,
  stage: pick(["Documents", "Assessment", "Interview", "Fee", "Enrolled", "Rejected"] as const),
  status: pick(["In Review", "Approved", "Pending", "Rejected"] as const),
}));

export type ClassRoom = {
  id: string;
  name: string;
  section: string;
  teacher: string;
  strength: number;
  room: string;
  subject: string;
};

export const classes: ClassRoom[] = GRADES.slice(0, 10).flatMap((g, gi) =>
  SECTIONS.slice(0, 3).map((s, si) => ({
    id: `cls_${gi}${si}`,
    name: g,
    section: s,
    teacher: teachers[(gi + si) % teachers.length].name,
    strength: 28 + Math.floor(pseudoRand() * 15),
    room: `R-${200 + gi * 4 + si}`,
    subject: pick(SUBJECTS),
  })),
);

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  assignedBy: string;
  submissions: number;
  total: number;
  status: "Open" | "Grading" | "Closed";
};

export const assignments: Assignment[] = Array.from({ length: 16 }, (_, i) => ({
  id: `asg_${400 + i}`,
  title: pick(["Algebra worksheet","Essay: Independence","Lab report — pendulum","Book review","Coding: sorting","Map exercise","Poem analysis","Trigonometry drill"]),
  subject: pick(SUBJECTS),
  grade: pick(GRADES),
  dueDate: `${Math.floor(pseudoRand() * 28) + 1} Nov 2025`,
  assignedBy: pick(teachers).name,
  submissions: Math.floor(pseudoRand() * 30),
  total: 32,
  status: pick(["Open", "Grading", "Closed"] as const),
}));

export type Exam = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: number;
  status: "Upcoming" | "Ongoing" | "Completed";
};

export const exams: Exam[] = Array.from({ length: 18 }, (_, i) => ({
  id: `exm_${500 + i}`,
  name: pick(["Mid-term","Unit Test 2","Term 2","Pre-board"]),
  grade: pick(GRADES),
  subject: pick(SUBJECTS),
  date: `${Math.floor(pseudoRand() * 28) + 1} Nov 2025`,
  duration: pick(["1h", "1h 30m", "2h", "3h"]),
  totalMarks: pick([50, 80, 100]),
  status: pick(["Upcoming", "Ongoing", "Completed"] as const),
}));

export type Invoice = {
  id: string;
  student: string;
  grade: string;
  category: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
};

export const invoices: Invoice[] = Array.from({ length: 22 }, (_, i) => {
  const s = students[i % students.length];
  const r = pseudoRand();
  return {
    id: `inv_${600 + i}`,
    student: s.name,
    grade: s.grade,
    category: pick(["Tuition","Transport","Hostel","Exam","Library","Uniform"]),
    amount: Math.floor(pseudoRand() * 40000) + 8000,
    dueDate: `${Math.floor(pseudoRand() * 28) + 1} Nov 2025`,
    status: r > 0.7 ? "Overdue" : r > 0.4 ? "Pending" : "Paid",
  };
});

export type Route = {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  stops: number;
  students: number;
  status: "On Route" | "At School" | "Maintenance";
};

export const routes: Route[] = Array.from({ length: 8 }, (_, i) => ({
  id: `rte_${700 + i}`,
  name: `Route ${String.fromCharCode(65 + i)} — ${pick(["Andheri","Bandra","Powai","Thane","Vashi","Chembur","Malad","Borivali"])}`,
  driver: `${pick(firstNames)} ${pick(lastNames)}`,
  vehicle: `MH-${String(1 + i).padStart(2, "0")}-BR-${Math.floor(1000 + pseudoRand() * 9000)}`,
  stops: 4 + Math.floor(pseudoRand() * 8),
  students: 20 + Math.floor(pseudoRand() * 25),
  status: pick(["On Route", "At School", "Maintenance"] as const),
}));

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  available: number;
  status: "Available" | "Low" | "Out";
};

export const books: Book[] = Array.from({ length: 20 }, (_, i) => {
  const copies = 3 + Math.floor(pseudoRand() * 10);
  const available = Math.floor(pseudoRand() * copies);
  return {
    id: `bok_${800 + i}`,
    title: pick(["To Kill a Mockingbird","1984","The Great Gatsby","Sapiens","Wings of Fire","A Brief History of Time","The Alchemist","Discovery of India","Malgudi Days","Norwegian Wood"]),
    author: `${pick(firstNames)} ${pick(lastNames)}`,
    isbn: `978-${Math.floor(1000000000 + pseudoRand() * 8999999999)}`,
    category: pick(["Fiction","Non-fiction","Science","History","Biography","Reference"]),
    copies,
    available,
    status: available === 0 ? "Out" : available < 3 ? "Low" : "Available",
  };
});

export type HostelRoom = {
  id: string;
  block: string;
  room: string;
  capacity: number;
  occupied: number;
  warden: string;
  status: "Full" | "Available" | "Maintenance";
};

export const hostelRooms: HostelRoom[] = Array.from({ length: 16 }, (_, i) => {
  const cap = pick([2, 3, 4]);
  const occ = Math.floor(pseudoRand() * (cap + 1));
  return {
    id: `hst_${900 + i}`,
    block: pick(["A","B","C","D"]),
    room: `${100 + i}`,
    capacity: cap,
    occupied: occ,
    warden: `${pick(firstNames)} ${pick(lastNames)}`,
    status: occ === cap ? "Full" : occ === 0 ? "Maintenance" : "Available",
  };
});

export type PayrollEntry = {
  id: string;
  employee: string;
  role: string;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  net: number;
  status: "Paid" | "Processing" | "Pending";
};

export const payroll: PayrollEntry[] = teachers.slice(0, 16).map((t, i) => {
  const basic = 45000 + Math.floor(pseudoRand() * 50000);
  const allow = Math.floor(basic * 0.3);
  const ded = Math.floor(basic * 0.12);
  return {
    id: `pay_${1000 + i}`,
    employee: t.name,
    role: "Teacher",
    month: "November 2025",
    basic,
    allowances: allow,
    deductions: ded,
    net: basic + allow - ded,
    status: pick(["Paid", "Processing", "Pending"] as const),
  };
});

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "All" | "Teachers" | "Students" | "Parents";
  author: string;
  publishedAt: string;
  priority: "Normal" | "Important" | "Urgent";
};

export const announcements: Announcement[] = [
  { id: "an_1", title: "Diwali holiday schedule", body: "School will remain closed from Oct 30 to Nov 5. Assignments due dates have been extended.", audience: "All", author: "Principal's Office", publishedAt: "2 hr ago", priority: "Important" },
  { id: "an_2", title: "PTM — Grades 6 to 10", body: "Parent–Teacher meeting on Saturday, 15 Nov, 9 AM to 1 PM. Please book slots via the portal.", audience: "Parents", author: "Academic Office", publishedAt: "Yesterday", priority: "Normal" },
  { id: "an_3", title: "Sports day rehearsal", body: "All house captains report to the ground at 3 PM today.", audience: "Students", author: "Sports Dept.", publishedAt: "3 hr ago", priority: "Normal" },
  { id: "an_4", title: "Term 2 examination datesheet", body: "Datesheets have been published. Please review and share concerns before Friday.", audience: "All", author: "Exam Cell", publishedAt: "2 days ago", priority: "Urgent" },
];

export type Message = {
  id: string;
  from: string;
  role: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
};

export const messages: Message[] = [
  { id: "m_1", from: "Priya Nair", role: "Parent · Grade 4A", subject: "Regarding transport pickup", preview: "Hi, could we change the pickup point from…", time: "2 min", unread: true },
  { id: "m_2", from: "Rahul Iyer", role: "Teacher · Math", subject: "Term 2 syllabus review", preview: "The proposed syllabus for term 2 includes…", time: "1 hr", unread: true },
  { id: "m_3", from: "Sara Kapoor", role: "Student · Grade 10B", subject: "Lab report extension", preview: "Ma'am, requesting a 2-day extension for…", time: "3 hr", unread: false },
  { id: "m_4", from: "Admin", role: "System", subject: "Weekly attendance summary", preview: "Attendance dropped by 1.2% this week…", time: "Yesterday", unread: false },
];

export type Role = {
  id: string;
  name: string;
  members: number;
  permissions: number;
  scope: string;
};

export const roles: Role[] = [
  { id: "r_1", name: "Principal", members: 1, permissions: 48, scope: "Full access" },
  { id: "r_2", name: "Academic Coordinator", members: 3, permissions: 32, scope: "Academics + Reports" },
  { id: "r_3", name: "Teacher", members: 164, permissions: 18, scope: "Classroom + Assignments" },
  { id: "r_4", name: "Accountant", members: 4, permissions: 22, scope: "Fees + Payroll" },
  { id: "r_5", name: "Front Office", members: 6, permissions: 14, scope: "Admissions + Comms" },
  { id: "r_6", name: "Parent", members: 2144, permissions: 6, scope: "Read-only child" },
];
