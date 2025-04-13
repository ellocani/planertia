import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarCard({ date, setDate }: { date: Date; setDate: (date: Date) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📅 캘린더</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow" />
      </CardContent>
    </Card>
  );
}
