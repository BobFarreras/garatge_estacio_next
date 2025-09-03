"use client";

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Mail, Phone, User,Settings, Loader2 } from 'lucide-react';

// Esquema de validació amb Zod
const appointmentSchema = z.object({
  name: z.string().min(2, "El nom ha de tenir almenys 2 caràcters."),
  email: z.string().email("Introdueix un email vàlid."),
  phone: z.string().min(9, "Introdueix un telèfon vàlid."),
  service: z.string().nonempty("Has de seleccionar un servei."),
  date: z.string().nonempty("Has de seleccionar una data."),
  time: z.string().nonempty("Has de seleccionar una hora."),
  message: z.string().optional(),
});

type AppointmentFormProps = {
  services: { id: number; title: string; }[];
};

const AppointmentForm = ({ services }: AppointmentFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control } = useForm({
    resolver: zodResolver(appointmentSchema)
  });

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];

  // ✅ Funció onSubmit actualitzada per a Airtable (via API Route)
  const onSubmit = async (data: z.infer<typeof appointmentSchema>) => {
    try {
      const response = await fetch('/api/cites/crear', { // Crida a la nostra API
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Hi ha hagut un problema en enviar la cita.');
      }
      toast({
        title: "✅ Cita Sol·licitada!",
        description: "Hem rebut la teva sol·licitud. Gràcies!",
      });
      reset();
    } catch (error: any) {
      toast({
        title: "❌ Error en la sol·licitud",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl border"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Demana Cita al Taller</h2>
        <p className="text-gray-600 mt-2">Omple el formulari i et confirmarem la teva hora.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nom Complet</Label>
            <div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input id="name" {...register("name")} placeholder="El teu nom" className="pl-10" /></div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input id="email" type="email" {...register("email")} placeholder="el.teu@correu.com" className="pl-10" /></div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Telèfon</Label>
          <div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input id="phone" type="tel" {...register("phone")} placeholder="600 123 456" className="pl-10" /></div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="service">Servei Sol·licitat</Label>
          <div className="relative mt-1"><Settings className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select {...register("service")} id="service" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white appearance-none">
              <option value="">-- Selecciona un servei --</option>
              {services.map(service => <option key={service.id} value={service.title}>{service.title}</option>)}
            </select>
          </div>
          {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="date">Data</Label>
            <div className="relative mt-1"><Input id="date" type="date" {...register("date")} min={today} /></div>
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="time">Hora</Label>
            <div className="relative mt-1">
              <select {...register("time")} id="time" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white appearance-none">
                <option value="">-- Selecciona una hora --</option>
                {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
              </select>
            </div>
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="message">Missatge (Opcional)</Label>
          <div className="relative mt-1"><Textarea id="message" {...register("message")} placeholder="Detalls addicionals sobre el teu vehicle o el servei..." /></div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 disabled:opacity-50">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviant...</> : <><Calendar className="mr-2 h-5 w-5" /> Sol·licitar Cita</>}
        </Button>
      </form>
    </motion.div>
  );
};

export default AppointmentForm;