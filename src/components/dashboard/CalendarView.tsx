import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Appointment = {
  id: number;
  date: string;
  status: string;
  patients: { name: string } | null;
  procedures: { name: string } | null;
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
};

export async function CalendarView() {
  const supabase = createClient();
  const currentDate = new Date();
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  const { data: appointmentsData } = await supabase
    .from("appointments")
    .select(`
      id,
      date,
      status,
      patients ( name ),
      procedures ( name )
    `)
    .gte("date", start.toISOString())
    .lte("date", end.toISOString())
    .order("date");

  const appointments: Appointment[] = appointmentsData || [];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), day));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas consultas</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </CardTitle>
              <CardDescription>Suas consultas do mês</CardDescription>
            </div>
            {/* Month navigation can be added here later */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-24 border rounded-lg p-2 transition-colors",
                    !isCurrentMonth && "bg-muted/50 text-muted-foreground/50",
                    isToday && "border-primary border-2",
                    isCurrentMonth && "hover:bg-accent"
                  )}
                >
                  <div className={cn("text-sm font-medium mb-1", isToday && "text-primary")}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={cn(
                          "text-xs p-1 rounded border truncate",
                          getStatusColor(apt.status)
                        )}
                      >
                        {format(new Date(apt.date), "HH:mm")} - {apt.patients?.name}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayAppointments.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {appointments.filter((a) => a.status === "Scheduled").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Confirmadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {appointments.filter((a) => a.status === "Confirmed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {appointments.filter((a) => a.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Canceladas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {appointments.filter((a) => a.status === "Cancelled").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}