'use client'

import { useState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, setHours, setMinutes } from 'date-fns'
import { createAppointment } from '@/app/appointments/actions'
import { toast } from 'sonner'

const appointmentFormSchema = z.object({
  patientId: z.string({ required_error: 'Paciente é obrigatório.' }),
  procedureId: z.string({ required_error: 'Procedimento é obrigatório.' }),
  date: z.date({ required_error: 'Data é obrigatória.' }),
  time: z.string({ required_error: 'Hora é obrigatória.' }),
  paymentMethod: z.string().optional(),
  observations: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type Patient = { id: string; name: string }
type Procedure = { id: string; name: string }

export function NewAppointmentForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [isPending, startTransition] = useTransition()

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: patientsData } = await supabase.from('patients').select('id, name').order('name');
      const { data: proceduresData } = await supabase.from('procedures').select('id, name').order('name');
      if (patientsData) setPatients(patientsData.map(p => ({ id: p.id.toString(), name: p.name })));
      if (proceduresData) setProcedures(proceduresData.map(p => ({ id: p.id.toString(), name: p.name })));
    }
    fetchData();
  }, [])

  const onSubmit = (values: AppointmentFormValues) => {
    startTransition(async () => {
      const [hours, minutes] = values.time.split(':').map(Number);
      const dateTime = setMinutes(setHours(values.date, hours), minutes).toISOString();

      const result = await createAppointment({
        patientId: values.patientId,
        procedureId: values.procedureId,
        dateTime: dateTime,
        paymentMethod: values.paymentMethod,
        observations: values.observations,
      });

      if (result.success) {
        toast.success(result.success)
        setIsOpen(false)
        form.reset()
      } else if (result.error) {
        toast.error(result.error)
      } else if (result.errors) {
        Object.values(result.errors).forEach(error => {
            if(error) toast.error(error[0])
        })
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Consulta</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para agendar uma nova consulta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-2">
            <Label>Paciente</Label>
            <Select onValueChange={(value) => form.setValue('patientId', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                    {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {form.formState.errors.patientId && <p className="text-sm text-red-500">{form.formState.errors.patientId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Procedimento</Label>
            <Select onValueChange={(value) => form.setValue('procedureId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o procedimento" />
              </SelectTrigger>
              <SelectContent>
                {procedures.map((procedure) => (
                  <SelectItem key={procedure.id} value={procedure.id}>
                    {procedure.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             {form.formState.errors.procedureId && <p className="text-sm text-red-500">{form.formState.errors.procedureId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !form.watch('date') && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('date') ? format(form.watch('date'), "PPP") : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={form.watch('date')} onSelect={(date) => form.setValue('date', date as Date)} initialFocus />
                </PopoverContent>
              </Popover>
              {form.formState.errors.date && <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" {...form.register('time')} />
              {form.formState.errors.time && <p className="text-sm text-red-500">{form.formState.errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <Select onValueChange={(value) => form.setValue('paymentMethod', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Opcional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Dinheiro</SelectItem>
                <SelectItem value="Card">Cartão</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Input id="observations" {...form.register('observations')} placeholder="Opcional"/>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}