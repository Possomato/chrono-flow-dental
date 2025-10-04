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
import { Toaster } from '@/components/ui/sonner';
import { NewProcedureForm } from '@/components/procedures/NewProcedureForm';

type Procedure = {
  id: number;
  name: string;
  description: string | null;
  value: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

async function ProceduresTable() {
  const supabase = createClient();
  const { data: proceduresData } = await supabase
    .from('procedures')
    .select('id, name, description, value')
    .order('name');

  const procedures: Procedure[] = proceduresData || [];

  return (
    <div className="border rounded-lg w-full bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {procedures.length > 0 ? (
            procedures.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell className="font-medium">{procedure.name}</TableCell>
                <TableCell>{procedure.description || 'N/A'}</TableCell>
                <TableCell>{formatCurrency(procedure.value)}</TableCell>
                <TableCell className="text-right">
                  {/* Action buttons will be added here */}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum procedimento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ProceduresPage() {
  return (
    <>
      <Toaster richColors />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Procedimentos</h1>
            <p className="text-muted-foreground">Visualize e cadastre novos procedimentos.</p>
          </div>
          <NewProcedureForm />
        </div>
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <ProceduresTable />
        </Suspense>
      </div>
    </>
  );
}