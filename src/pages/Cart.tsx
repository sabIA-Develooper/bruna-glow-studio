import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video':
        return '🎥';
      case 'ebook':
        return '📚';
      case 'audiobook':
        return '🎧';
      default:
        return '📋';
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth?redirect=/cart");
      return;
    }
    // TODO real: integração de pagamento
    alert("Pedido confirmado! (fluxo de teste)");
  };
  
  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-warm-white via-nude-light to-cream pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <ShoppingBag className="w-24 h-24 text-bronze/30 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-bronze mb-4">
                Seu carrinho está vazio
              </h1>
              <p className="text-bronze-light mb-8">
                Explore nossos cursos incríveis e adicione algo ao seu carrinho!
              </p>
              <Button
                onClick={() => navigate('/#courses')}
                className="bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm"
              >
                Ver Cursos
              </Button>
            </div>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-bronze">Meu Carrinho</h1>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Carrinho
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-bronze/10 to-bronze-light/10 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-bronze">{item.title}</h3>
                        <Badge variant="outline" className="border-bronze text-bronze mt-1">
                          {item.category === 'video' ? 'Vídeo' : 
                           item.category === 'ebook' ? 'E-book' : 'Audiobook'}
                        </Badge>
                        <p className="text-lg font-bold text-bronze mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-bronze">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.title} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-bronze">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-bronze to-bronze-light hover:shadow-warm"
                    size="lg"
                  >
                    {user ? 'Finalizar Compra' : 'Entrar para Comprar'}
                  </Button>

                  {!user && (
                    <p className="text-sm text-bronze-light text-center">
                      Você precisa estar logado para finalizar a compra
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;