import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-4xl">YOUR CART IS EMPTY</h1>
            <p className="text-muted-foreground max-w-md">
              Looks like you haven't added anything to your cart yet.
              Start shopping to fill it up!
            </p>
            <Link to="/shop">
              <Button variant="hero" className="group">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl mb-12">YOUR CART</h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${item.product.customDesignId || 'no-design'}`}
                  className="flex gap-6 bg-card p-6 border border-border group"
                >
                  {/* Image */}
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-secondary overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-display text-xl hover:text-primary transition-smooth">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.product.designer && (
                            <p className="text-sm text-muted-foreground">
                              by {item.product.designer}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor, item.product.customDesignId)}
                          className="text-muted-foreground hover:text-destructive transition-smooth"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                        <span>Size: <span className="text-foreground">{item.selectedSize}</span></span>
                        <span>Color: <span className="text-foreground">{item.selectedColor}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1, item.product.customDesignId)}
                          className="w-8 h-8 bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1, item.product.customDesignId)}
                          className="w-8 h-8 bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-display text-xl text-primary">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-8 sticky top-24">
                <h2 className="font-display text-2xl mb-6">ORDER SUMMARY</h2>

                <div className="space-y-4 border-b border-border pb-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="font-display text-xl">TOTAL</span>
                  <span className="font-display text-xl text-primary">${totalPrice}</span>
                </div>

                <Link to="/checkout" className="block">
                  <Button variant="hero" className="w-full group">
                    Checkout
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Link to="/shop" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Promo Code */}
                <div className="mt-8 pt-6 border-t border-border">
                  <label className="text-sm text-muted-foreground mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 bg-secondary border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
                    />
                    <Button variant="secondary">Apply</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
