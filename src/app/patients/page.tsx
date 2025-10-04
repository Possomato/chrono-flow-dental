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
import { Loader2 } from 'lucide-react';
import { NewPatientForm } from '@/components/patients/NewPatientForm';
import { Toaster } from '@/components/ui/sonner';

type Patient = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
};

async function PatientsTable() {
  const supabase = createClient();
  const { data: patientsData } = await supabase
    .from('patients')
    .select('id, name, email, phone')
    .order('name');

  const patients: Patient[] = patientsData || [];

  return (
    <div className="border rounded-lg w-full bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.email || 'N/A'}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell className="text-right">
                  {/* Action buttons will be added here */}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum paciente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <>
      <Toaster richColors />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Pacientes</h1>
            <p className="text-muted-foreground">Visualize e cadastre novos pacientes.</p>
          </div>
          <NewPatientForm />
        </div>
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <PatientsTable />
        </Suspense>
      </div>
    </>
  );
}