'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login, signup } from './actions'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Loader2 } from "lucide-react";
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/sonner';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

export default function LoginPage() {
  const [loginState, loginAction] = useFormState(login, undefined)
  const [signupState, signupAction] = useFormState(signup, undefined)
  const { toast } = useToast();

  useEffect(() => {
    if (loginState?.message) {
      toast({
        title: 'Erro no Login',
        description: loginState.message,
        variant: 'destructive',
      })
    }
    if (signupState?.message) {
        toast({
            title: 'Erro no Cadastro',
            description: signupState.message,
            variant: 'destructive',
        })
    }
  }, [loginState, signupState, toast]);

  return (
    <>
    <Toaster />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">DentalCare</CardTitle>
          <CardDescription>Sistema de Gestão Odontológica</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form action={loginAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                  {loginState?.errors?.email && <p className="text-sm text-red-500">{loginState.errors.email[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  {loginState?.errors?.password && <p className="text-sm text-red-500">{loginState.errors.password[0]}</p>}
                </div>
                <SubmitButton>Entrar</SubmitButton>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form action={signupAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Dr. João Silva"
                    required
                  />
                  {signupState?.errors?.name && <p className="text-sm text-red-500">{signupState.errors.name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cro">CRO</Label>
                  <Input
                    id="cro"
                    name="cro"
                    type="number"
                    placeholder="12345"
                    required
                  />
                   {signupState?.errors?.cro && <p className="text-sm text-red-500">{signupState.errors.cro[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    required
                  />
                  {signupState?.errors?.phone && <p className="text-sm text-red-500">{signupState.errors.phone[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                  {signupState?.errors?.email && <p className="text-sm text-red-500">{signupState.errors.email[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  {signupState?.errors?.password && <p className="text-sm text-red-500">{signupState.errors.password[0]}</p>}
                </div>
                <SubmitButton>Cadastrar</SubmitButton>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </>
  );
}