import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
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
      navigate('/auth');
      return;
    }

    if (serviceId) {
      fetchService();
    }

    // Preencher dados do usuário
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !clientName || !clientEmail || !clientPhone) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user?.id,
          service_id: serviceId,
          appointment_date: appointmentDate.toISOString(),
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          notes: notes,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Agendamento realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao realizar agendamento');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-warm-white via-nude-light to-cream pt-20">
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-bronze">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-warm-white via-nude-light to-cream pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
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
              <h1 className="text-3xl font-bold text-bronze">Agendar Serviço</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Resumo do Serviço */}
              <div className="lg:col-span-1">
                <Card className="bg-white/80 backdrop-blur-sm sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-bronze">Resumo do Serviço</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Agendamento;