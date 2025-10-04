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
import { createProcedure } from '@/app/procedures/actions'
import { Textarea } from '@/components/ui/textarea'

const procedureFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  description: z.string().optional(),
  value: z.coerce.number().min(0, 'O valor deve ser positivo.'),
});

type ProcedureFormValues = z.infer<typeof procedureFormSchema>;

export function NewProcedureForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ProcedureFormValues>({
    resolver: zodResolver(procedureFormSchema),
    defaultValues: {
      name: '',
      description: '',
      value: 0,
    }
  });

  const onSubmit = (values: ProcedureFormValues) => {
    startTransition(async () => {
      const result = await createProcedure(values);

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
          Cadastrar Procedimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Procedimento</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo procedimento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Procedimento</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input id="value" type="number" step="0.01" {...form.register('value')} />
            {form.formState.errors.value && <p className="text-sm text-red-500">{form.formState.errors.value.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...form.register('description')} placeholder="Opcional" />
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