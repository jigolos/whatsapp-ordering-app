import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-[var(--muted-foreground)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black tracking-tight">{value}</p>
        {subtitle ? <p className="mt-1 text-sm text-[var(--muted-foreground)]">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}
