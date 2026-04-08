import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { jobsAPI } from "@/lib/api";
import { Briefcase, ExternalLink } from "lucide-react";

export default function Jobs({ embedded, defaultTab }: { embedded?: boolean; defaultTab?: "10th" | "12th" }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tab = defaultTab || "10th";

  useEffect(() => {
    let mounted = true;
    jobsAPI.getAll().then((data) => {
      if (mounted && Array.isArray(data)) setJobs(data);
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const govt10 = jobs.filter((j) => j.category === "govt_10");
  const skill10 = jobs.filter((j) => j.category === "skill_10");
  const govt12 = jobs.filter((j) => j.category === "govt_12");
  const private12 = jobs.filter((j) => j.category === "private_12");

  const JobCard = ({ j }: { j: any }) => (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Briefcase className="h-6 w-6 text-primary mb-1" />
        <CardTitle className="text-lg">{j.title}</CardTitle>
        <CardDescription className="line-clamp-2">{j.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 text-sm">
        {j.eligibility && <p><span className="font-medium">Eligibility:</span> {j.eligibility}</p>}
        {j.ageLimit && <p><span className="font-medium">Age:</span> {j.ageLimit}</p>}
        {j.salaryRange && <p><span className="font-medium">Salary:</span> {j.salaryRange}</p>}
        {j.selectionProcess && <p className="text-muted-foreground line-clamp-2">{j.selectionProcess}</p>}
        {j.officialWebsite && (
          <a href={j.officialWebsite.startsWith("http") ? j.officialWebsite : `https://${j.officialWebsite}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1 mt-1">
              <ExternalLink className="h-3 w-3" /> Official Website
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );

  const content = (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{tab === "10th" ? "Jobs After 10th" : "Jobs After 12th"}</h1>
          <p className="text-muted-foreground">
            Government jobs, skill-based careers and private sector options. Eligibility, selection process and salary ranges for rural youth.
          </p>
        </div>
        <Tabs defaultValue={tab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="10th">Jobs After 10th</TabsTrigger>
            <TabsTrigger value="12th">Jobs After 12th</TabsTrigger>
          </TabsList>
          <TabsContent value="10th" className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Government Jobs After 10th</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Indian Army (Soldier GD), Navy (MR), Air Force (Group Y), Railway Group D, SSC MTS, Police Constable, Post Office GDS, Forest Guard and state-level posts.
              </p>
              {loading ? <p>Loading...</p> : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {govt10.map((j) => <JobCard key={j._id || j.id} j={j} />)}
                </div>
              )}
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-4">Skill-Based Jobs After 10th</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Electrician, Fitter, Mechanic, Plumber, Welder, Tailoring, Data Entry, Mobile Repairing, Driving, Construction Supervisor. ITI and certification options.
              </p>
              {loading ? <p>Loading...</p> : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {skill10.map((j) => <JobCard key={j._id || j.id} j={j} />)}
                </div>
              )}
            </section>
          </TabsContent>
          <TabsContent value="12th" className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Government Jobs After 12th</h2>
              <p className="text-muted-foreground text-sm mb-4">
                SSC CHSL, NDA, Indian Army Clerk, Police Sub Inspector, Railway NTPC, Banking Clerk, State Govt, Defence, Paramilitary, Forest Department.
              </p>
              {loading ? <p>Loading...</p> : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {govt12.map((j) => <JobCard key={j._id || j.id} j={j} />)}
                </div>
              )}
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-4">Private Sector Jobs After 12th</h2>
              <p className="text-muted-foreground text-sm mb-4">
                BPO, Sales Executive, Office Assistant, Data Entry, Customer Support, Digital Marketing Intern, Field Executive, Hospital Assistant, Lab Technician, Retail Associate.
              </p>
              {loading ? <p>Loading...</p> : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {private12.map((j) => <JobCard key={j._id || j.id} j={j} />)}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
  );
  if (embedded) return content;
  return <AppLayout>{content}</AppLayout>;
}
