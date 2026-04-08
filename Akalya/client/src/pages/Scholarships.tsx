import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { scholarshipsAPI } from "@/lib/api";
import { format } from "date-fns";
import { Award, ExternalLink, Calendar } from "lucide-react";

export default function Scholarships({ embedded }: { embedded?: boolean }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("");
  const [forClass, setForClass] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    const params: any = {};
    if (category) params.category = category;
    if (forClass) params.forClass = forClass;
    scholarshipsAPI.getAll(params).then((data) => {
      if (mounted && Array.isArray(data)) setList(data);
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [category, forClass]);

  const content = (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scholarships for Rural Students</h1>
          <p className="text-muted-foreground">
            Find merit-based, need-based and category-wise scholarships. Check eligibility and deadlines before applying.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="merit">Merit</SelectItem>
                <SelectItem value="need-based">Need-based</SelectItem>
                <SelectItem value="caste">Caste / Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Class / Level</Label>
            <Select value={forClass || "all"} onValueChange={(v) => setForClass(v === "all" ? "" : v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="10">Class 10</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
                <SelectItem value="graduation">Graduation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : list.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No scholarships match your filters. Try changing filters or check back later.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <Card key={s._id || s.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Award className="h-8 w-8 text-primary shrink-0" />
                    {s.category && <Badge variant="secondary">{s.category}</Badge>}
                  </div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  {s.provider && <CardDescription>{s.provider}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-1 space-y-2">
                  {s.amount && <p className="text-sm font-medium text-primary">{s.amount}</p>}
                  {s.eligibility && <p className="text-sm text-muted-foreground line-clamp-2">{s.eligibility}</p>}
                  {s.deadline && (
                    <p className="text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Deadline: {format(new Date(s.deadline), "dd MMM yyyy")}
                    </p>
                  )}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {s.applicationUrl && (
                      <a href={s.applicationUrl.startsWith("http") ? s.applicationUrl : `https://${s.applicationUrl}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Official Website / Apply
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
  );

  if (embedded) return content;
  return <AppLayout>{content}</AppLayout>;
}
