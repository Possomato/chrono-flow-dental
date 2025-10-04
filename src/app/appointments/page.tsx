import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { NewAppointmentForm } from '@/components/appointments/NewAppointmentForm';
import { Toaster } from '@/components/ui/sonner';

type Appointment = {
  id: number;
  date: string;
  status: string;
  patients: { name: string } | null;
  procedures: { name: string } | null;
  payment_method: string | null;
};

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'default';
    case 'confirmed':
      return 'secondary';
    case 'completed':
      return 'outline';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

async function AppointmentsTable() {
  const supabase = createClient();
  const { data: appointmentsData } = await supabase
    .from('appointments')
    .select(`
      id,
      date,
      status,
      payment_method,
      patients ( name ),
      procedures ( name )
    `)
    .order('date', { ascending: false });

  const appointments: Appointment[] = appointmentsData || [];

  return (
    <div className="border rounded-lg w-full bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Procedimento</TableHead>
            <TableHead>Data e Hora</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.patients?.name || 'N/A'}</TableCell>
                <TableCell>{appointment.procedures?.name || 'N/A'}</TableCell>
                <TableCell>{format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm")}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(appointment.status)}>{appointment.status}</Badge>
                </TableCell>
                <TableCell>{appointment.payment_method || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  {/* Action buttons will be added here */}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhuma consulta encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <>
      <Toaster richColors />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Consultas</h1>
            <p className="text-muted-foreground">Visualize e gerencie todas as suas consultas.</p>
          </div>
          <NewAppointmentForm />
        </div>
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <AppointmentsTable />
        </Suspense>
      </div>
    </>
  );
}