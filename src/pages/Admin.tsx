import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { coursesApi, servicesApi, appointmentsApi, ordersApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, BookOpen, Calendar, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalServices: 0,
    totalAppointments: 0,
    totalOrders: 0
  });

  // Forms state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'video',
    duration: '',
    level: 'Básico',
    content_url: '',
    image_url: ''
  });

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      // Fetch courses
      const coursesData = await coursesApi.getCourses();
      setCourses(coursesData || []);

      // Fetch services
      const servicesData = await servicesApi.getServices();
      setServices(servicesData || []);

      // Fetch appointments
      const appointmentsData = await appointmentsApi.getAppointments();
      setAppointments(appointmentsData || []);

      // Fetch orders
      const ordersData = await ordersApi.getOrders();
      setOrders(ordersData || []);

      // Update stats
      setStats({
        totalCourses: coursesData?.length || 0,
        totalServices: servicesData?.length || 0,
        totalAppointments: appointmentsData?.length || 0,
        totalOrders: ordersData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await coursesApi.createCourse({
        ...courseForm,
        price: parseFloat(courseForm.price)
      });

      toast.success('Curso criado com sucesso!');
      setCourseForm({
        title: '',
        description: '',
        price: '',
        category: 'video',
        duration: '',
        level: 'Básico',
        content_url: '',
        image_url: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Erro ao criar curso');
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await servicesApi.createService({
        ...serviceForm,
        price: parseFloat(serviceForm.price),
        duration: parseInt(serviceForm.duration)
      });

      toast.success('Serviço criado com sucesso!');
      setServiceForm({
        name: '',
        description: '',
        price: '',
        duration: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Erro ao criar serviço');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      await coursesApi.deleteCourse(id);

      toast.success('Curso excluído com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erro ao excluir curso');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await servicesApi.deleteService(id);

      toast.success('Serviço excluído com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir serviço');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-warm-white via-nude-light to-cream flex items-center justify-center">
      <div className="text-bronze">Carregando...</div>
    </div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-warm-white via-nude-light to-cream pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-bronze">Dashboard Administrativo</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-bronze text-bronze hover:bg-bronze hover:text-cream"
            >
              ← Voltar ao Site
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <BookOpen className="w-8 h-8 text-bronze" />
                  <div>
                    <p className="text-sm text-bronze-light">Total de Cursos</p>
                    <p className="text-2xl font-bold text-bronze">{stats.totalCourses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="w-8 h-8 text-bronze" />
                  <div>
                    <p className="text-sm text-bronze-light">Total de Serviços</p>
                    <p className="text-2xl font-bold text-bronze">{stats.totalServices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Calendar className="w-8 h-8 text-bronze" />
                  <div>
                    <p className="text-sm text-bronze-light">Agendamentos</p>
                    <p className="text-2xl font-bold text-bronze">{stats.totalAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <ShoppingCart className="w-8 h-8 text-bronze" />
                  <div>
                    <p className="text-sm text-bronze-light">Pedidos</p>
                    <p className="text-2xl font-bold text-bronze">{stats.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="courses" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
                Cursos
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
                Serviços
              </TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
                Agendamentos
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-bronze data-[state=active]:text-cream">
                Pedidos
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-bronze flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Criar Novo Curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={courseForm.category} onValueChange={(value) => setCourseForm({...courseForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="ebook">E-book</SelectItem>
                          <SelectItem value="audiobook">Audiobook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Nível</Label>
                      <Select value={courseForm.level} onValueChange={(value) => setCourseForm({...courseForm, level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermediário">Intermediário</SelectItem>
                          <SelectItem value="Avançado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duração</Label>
                      <Input
                        id="duration"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                        placeholder="ex: 2h 30min"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content_url">URL do Conteúdo (Kiwify)</Label>
                      <Input
                        id="content_url"
                        value={courseForm.content_url}
                        onChange={(e) => setCourseForm({...courseForm, content_url: e.target.value})}
                        placeholder="https://kiwify.app/..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">URL da Imagem</Label>
                      <Input
                        id="image_url"
                        value={courseForm.image_url}
                        onChange={(e) => setCourseForm({...courseForm, image_url: e.target.value})}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" className="bg-gradient-to-r from-bronze to-bronze-light">
                        Criar Curso
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Courses List */}
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-bronze">{course.title}</h3>
                          <p className="text-sm text-bronze-light mt-1">{course.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">{course.category}</Badge>
                            <Badge variant="outline">{course.level}</Badge>
                            <span className="text-sm font-medium">{formatPrice(course.price)}</span>
                            <span className="text-sm text-bronze-light">{course.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-bronze flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Criar Novo Serviço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duração (minutos)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={serviceForm.duration}
                        onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" className="bg-gradient-to-r from-bronze to-bronze-light">
                        Criar Serviço
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Services List */}
              <div className="space-y-4">
                {services.map((service) => (
                  <Card key={service.id} className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-bronze">{service.name}</h3>
                          <p className="text-sm text-bronze-light mt-1">{service.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm font-medium">{formatPrice(service.price)}</span>
                            <span className="text-sm text-bronze-light">{service.duration} minutos</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-bronze">{appointment.client_name}</h3>
                          <p className="text-sm text-bronze-light">{appointment.services?.name}</p>
                          <p className="text-sm text-bronze-light">{appointment.client_email} • {appointment.client_phone}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">
                              {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                            </Badge>
                            <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-bronze">{order.profiles?.full_name || 'Cliente'}</h3>
                          <p className="text-sm text-bronze-light">Total: {formatPrice(order.total_amount)}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">
                              {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </Badge>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;