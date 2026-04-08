import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { entranceExamsAPI } from "@/lib/api";
import { FileQuestion, MapPin, ArrowRight, ExternalLink } from "lucide-react";

const STATES = ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu", "All"];

export function EntranceExamsList({ detailBasePath = "/entrance-exams" }: { detailBasePath?: string }) {
  const [national, setNational] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [stateFilter, setStateFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      entranceExamsAPI.getAll({ level: "national" }),
      entranceExamsAPI.getAll({ level: "state" }),
    ]).then(([n, s]) => {
      if (mounted) {
        setNational(Array.isArray(n) ? n : []);
        setState(Array.isArray(s) ? s : []);
      }
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filteredState = stateFilter && stateFilter !== "All"
    ? state.filter((e) => (e.state || "").toLowerCase().includes(stateFilter.toLowerCase()))
    : state;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">National & State Entrance Exams</h1>
        <p className="text-muted-foreground">
          Overview, eligibility, exam pattern, syllabus and important dates for major exams.
          Use filters for state-level exams.
        </p>
      </div>
      <Tabs defaultValue="national" className="space-y-6">
        <TabsList>
          <TabsTrigger value="national">National</TabsTrigger>
          <TabsTrigger value="state">State Level</TabsTrigger>
        </TabsList>
        <TabsContent value="national" className="space-y-4">
          <p className="text-sm text-muted-foreground">JEE, NEET, CUET, CLAT, NDA, NIFT, NID, SSC, Banking, Railway and more.</p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {national.map((e) => (
                <Card key={e._id || e.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <FileQuestion className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{e.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{e.overview}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`${detailBasePath}/${e.slug || e._id}`}>
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        View details <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="state" className="space-y-4">
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-sm font-medium">Filter by state:</span>
            <Select value={stateFilter || "All"} onValueChange={setStateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredState.map((e) => (
                <Card key={e._id || e.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {e.state && <Badge variant="secondary">{e.state}</Badge>}
                    </div>
                    <CardTitle className="text-lg">{e.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{e.overview}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`${detailBasePath}/${e.slug || e._id}`}>
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        View details <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function EntranceExamDetail({ embedded }: { embedded?: boolean }) {
  const { slug } = useParams<{ slug: string }>();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const backTo = embedded ? "/dashboard/student/career-gateway/entrance-exams" : "/entrance-exams";

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    entranceExamsAPI.getBySlug(slug).then(setExam).catch(() => setExam(null))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    const load = <div className="container py-8">Loading...</div>;
    if (embedded) return load;
    return <AppLayout>{load}</AppLayout>;
  }
  if (!exam) {
    const err = <div className="container py-8">Exam not found.</div>;
    if (embedded) return err;
    return <AppLayout>{err}</AppLayout>;
  }

  const sections = [
    { title: "Overview", text: exam.overview },
    { title: "Eligibility", text: exam.eligibility },
    { title: "Age limit", text: exam.ageLimit },
    { title: "Exam pattern", text: exam.examPattern },
    { title: "Syllabus", text: exam.syllabus },
    { title: "Important dates", text: exam.importantDates },
    { title: "Career opportunities", text: exam.careerOpportunities },
  ];

  const content = (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={backTo} className="text-sm text-primary hover:underline mb-2 inline-block">← Back to exams</Link>
          <h1 className="text-3xl font-bold">{exam.name}</h1>
          {exam.state && <Badge className="mt-2">{exam.state}</Badge>}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {sections.filter((s) => s.text).map((s) => (
              <Card key={s.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Official website</CardTitle>
              </CardHeader>
              <CardContent>
                {exam.officialWebsite ? (
                  <a href={exam.officialWebsite.startsWith("http") ? exam.officialWebsite : `https://${exam.officialWebsite}`} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-2 hover:underline">
                    <ExternalLink className="h-4 w-4" />
                    Official Website
                  </a>
                ) : (
                  <p className="text-muted-foreground">Not provided</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
  if (embedded) return content;
  return <AppLayout>{content}</AppLayout>;
}

export default function EntranceExams({ embedded }: { embedded?: boolean }) {
  const detailBasePath = embedded ? "/dashboard/student/career-gateway/entrance-exams" : "/entrance-exams";
  const list = <EntranceExamsList detailBasePath={detailBasePath} />;
  if (embedded) return list;
  return <AppLayout>{list}</AppLayout>;
}
