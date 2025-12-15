import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, CreditCard, Truck, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    saveInfo: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
      });
      navigate('/');
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl mb-8">CHECKOUT</h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact */}
                <div className="space-y-4">
                  <h2 className="font-display text-xl flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                    CONTACT
                  </h2>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                    className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone (optional)"
                    className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                  />
                </div>

                {/* Shipping */}
                <div className="space-y-4">
                  <h2 className="font-display text-xl flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                    SHIPPING
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      required
                      className="bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      required
                      className="bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                    className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                      className="bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      required
                      className="bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                    />
                  </div>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                    className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                  />
                </div>

                {/* Payment */}
                <div className="space-y-4">
                  <h2 className="font-display text-xl flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                    PAYMENT
                  </h2>
                  <div className="bg-card border border-border p-4 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">Secure payment with SSL encryption</span>
                  </div>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card Number"
                    required
                    className="w-full bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                    />
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="CVC"
                      required
                      className="bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                    />
                  </div>
                </div>

                {/* Save Info */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-secondary border border-border checked:bg-primary checked:border-primary"
                  />
                  <span className="text-sm text-muted-foreground">Save my information for faster checkout</span>
                </label>

                {/* Submit */}
                <Button
                  variant="hero"
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Place Order • ${totalPrice}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:pl-12 lg:border-l border-border">
              <h2 className="font-display text-2xl mb-6">ORDER SUMMARY</h2>

              {/* Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-24 bg-card overflow-hidden relative shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.selectedSize} / {item.selectedColor}
                      </p>
                      <p className="text-sm text-primary mt-2">${item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between font-display text-xl pt-3 border-t border-border">
                  <span>TOTAL</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span>All Cards Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
