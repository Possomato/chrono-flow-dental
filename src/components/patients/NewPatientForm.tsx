'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { createPatient } from '@/app/patients/actions'

const patientFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  phone: z.string().min(10, 'Telefone inválido.'),
  email: z.string().email('Email inválido.').optional().or(z.literal('')),
  observations: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

export function NewPatientForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
        name: '',
        phone: '',
        email: '',
        observations: '',
    }
  });

  const onSubmit = (values: PatientFormValues) => {
    startTransition(async () => {
      const result = await createPatient(values);

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
          Cadastrar Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo paciente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" {...form.register('phone')} />
                {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...form.register('email')} />
                {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
              </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Input id="observations" {...form.register('observations')} placeholder="Alergias, histórico médico, etc." />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}