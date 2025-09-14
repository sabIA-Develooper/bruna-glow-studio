import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, X, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Header from '@/components/Header';

const Agendamento = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const serviceId = location.state?.serviceId;

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/agendamento');
      return;
    }

    // Carrega lista de serviços sempre
    fetchActiveServices();
    
    // Carrega agendamentos do usuário
    fetchUserAppointments();

    // Se veio com um serviço pré-selecionado
    if (serviceId) {
      fetchService();
    }

    // Preencher dados do usuário se existir
    if (user?.email) {
      setClientEmail(user.email);
    }
  }, [serviceId, user, navigate]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Erro ao buscar serviço:', error);
      toast.error('Erro ao carregar serviço');
    }
  };

  const fetchActiveServices = async () => {
    try {
      setServicesLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setServicesList(data || []);
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchUserAppointments = async () => {
    if (!user) return;
    
    try {
      setLoadingAppointments(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*, services(name, price)')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: 'Pendente', variant: 'default' as const },
      'confirmed': { label: 'Confirmado', variant: 'default' as const },
      'cancelled': { label: 'Cancelado', variant: 'destructive' as const },
      'completed': { label: 'Concluído', variant: 'secondary' as const }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .eq('user_id', user?.id); // Security check

      if (error) throw error;

      toast.success('Agendamento cancelado com sucesso!');
      fetchUserAppointments(); // Refresh the list
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast.error('Erro ao cancelar agendamento');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !selectedDate || !selectedTime || !clientName || !clientEmail || !clientPhone) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      if (user) {
        const { error } = await supabase
          .from('appointments')
          .insert({
            user_id: user.id,
            service_id: service?.id,
            appointment_date: appointmentDate.toISOString(),
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            notes: notes,
            status: 'pending'
          });

        if (error) throw error;

        toast.success('Agendamento realizado com sucesso!');
        fetchUserAppointments(); // Refresh appointments list
        // Reset form
        setSelectedDate(undefined);
        setSelectedTime('');
        setClientName('');
        setClientPhone('');
        setNotes('');
        setService(null);
      } else {
        toast.error('Você precisa estar logado para agendar');
        navigate('/auth?redirect=/agendamento');
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao realizar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-warm-white via-nude-light to-cream pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-bronze hover:text-bronze-light"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold text-bronze">Agendamentos</h1>
            </div>

            <Tabs defaultValue="new-appointment" className="space-y-6">
              <TabsList className="bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="new-appointment" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
                  Novo Agendamento
                </TabsTrigger>
                <TabsTrigger value="my-appointments" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
                  Meus Agendamentos
                </TabsTrigger>
              </TabsList>

              {/* New Appointment Tab */}
              <TabsContent value="new-appointment">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Resumo do Serviço */}
                  <div className="lg:col-span-1">
                    <Card className="bg-white/80 backdrop-blur-sm sticky top-24">
                      <CardHeader>
                        <CardTitle className="text-bronze">Resumo do Serviço</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {service ? (
                          <>
                            <div>
                              <h3 className="font-semibold text-bronze">{service.name}</h3>
                              <p className="text-sm text-bronze-light mt-1">{service.description}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-bronze-light">
                              <Clock className="w-4 h-4" />
                              <span>{service.duration} minutos</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-bronze-light">
                              <MapPin className="w-4 h-4" />
                              <span>No estúdio</span>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-bronze">Preço:</span>
                                <span className="text-lg font-bold text-bronze">
                                  {formatPrice(service.price)}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-bronze-light">
                            Selecione um serviço para ver o resumo e valor.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Formulário de Agendamento */}
                  <div className="lg:col-span-2">
                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-bronze">Dados do Agendamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Serviço */}
                          <div>
                            <Label htmlFor="service">Serviço *</Label>
                            <Select
                              value={service?.id || ''}
                              onValueChange={(id) => {
                                const s = servicesList.find((sv: any) => sv.id === id);
                                if (s) setService(s);
                              }}
                            >
                              <SelectTrigger id="service">
                                <SelectValue placeholder={servicesLoading ? 'Carregando...' : 'Selecione um serviço'} />
                              </SelectTrigger>
                              <SelectContent>
                                {servicesList.map((sv: any) => (
                                  <SelectItem key={sv.id} value={sv.id}>
                                    {sv.name} — {formatPrice(sv.price)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Dados Pessoais */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="clientName">Nome Completo *</Label>
                              <Input
                                id="clientName"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="clientEmail">E-mail *</Label>
                              <Input
                                id="clientEmail"
                                type="email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="clientPhone">Telefone/WhatsApp *</Label>
                            <Input
                              id="clientPhone"
                              type="tel"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="(11) 99999-9999"
                              required
                            />
                          </div>

                          {/* Seleção de Data */}
                          <div>
                            <Label>Data do Agendamento *</Label>
                            <div className="mt-2">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => date < new Date() || date.getDay() === 0}
                                className="rounded-md border"
                              />
                            </div>
                          </div>

                          {/* Seleção de Horário */}
                          {selectedDate && (
                            <div>
                              <Label>Horário Disponível *</Label>
                              <div className="grid grid-cols-4 gap-2 mt-2">
                                {timeSlots.map((time) => (
                                  <Button
                                    key={time}
                                    type="button"
                                    variant={selectedTime === time ? "default" : "outline"}
                                    className={`text-sm ${
                                      selectedTime === time
                                        ? "bg-bronze text-primary-foreground"
                                        : "border-bronze text-bronze hover:bg-bronze hover:text-primary-foreground"
                                    }`}
                                    onClick={() => setSelectedTime(time)}
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Observações */}
                          <div>
                            <Label htmlFor="notes">Observações</Label>
                            <Textarea
                              id="notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Observações especiais, alergias, preferências..."
                              rows={3}
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm"
                            size="lg"
                          >
                            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* My Appointments Tab */}
              <TabsContent value="my-appointments">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-bronze flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Meus Agendamentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingAppointments ? (
                      <div className="text-center py-8 text-bronze-light">
                        Carregando agendamentos...
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="text-center py-8 text-bronze-light">
                        Você não possui agendamentos.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <Card key={appointment.id} className="border border-bronze/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold text-bronze">
                                      {appointment.services?.name || 'Serviço não encontrado'}
                                    </h3>
                                    <Badge variant={getStatusBadge(appointment.status).variant}>
                                      {getStatusBadge(appointment.status).label}
                                    </Badge>
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-4 text-sm text-bronze-light">
                                    <div>
                                      <div className="flex items-center space-x-2 mb-1">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{formatDate(appointment.appointment_date)}</span>
                                      </div>
                                      <div>
                                        <strong>Cliente:</strong> {appointment.client_name}
                                      </div>
                                      <div>
                                        <strong>Email:</strong> {appointment.client_email}
                                      </div>
                                      <div>
                                        <strong>Telefone:</strong> {appointment.client_phone}
                                      </div>
                                    </div>
                                    <div>
                                      {appointment.services?.price && (
                                        <div className="mb-1">
                                          <strong>Valor:</strong> {formatPrice(appointment.services.price)}
                                        </div>
                                      )}
                                      {appointment.notes && (
                                        <div>
                                          <strong>Observações:</strong> {appointment.notes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="text-destructive hover:text-destructive border-destructive/50 hover:bg-destructive/10"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancelar
                                  </Button>
                                ) : null}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Agendamento;