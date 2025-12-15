import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Upload, Camera, ChevronRight, RefreshCw, Download, Sparkles } from 'lucide-react';

const VirtualTryOnPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    // Simulating processing - in real implementation, this would call your API
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
    }, 2000);
  };

  const resetTryOn = () => {
    setSelectedImage(null);
    setShowResult(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-24 bg-card relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">
                AI Powered
              </span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl">
              VIRTUAL<br />
              <span className="text-gradient">TRY-ON</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg text-lg">
              See how our tees look on you before buying. Upload a photo and experience the future of online shopping.
            </p>
          </div>
        </section>

        {/* Try On Interface */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Upload & Preview */}
              <div className="space-y-6">
                <h2 className="font-display text-3xl">1. UPLOAD YOUR PHOTO</h2>
                
                <div className="relative">
                  {!selectedImage ? (
                    <label className="block aspect-[3/4] bg-card border-2 border-dashed border-border hover:border-primary cursor-pointer transition-smooth group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-smooth" />
                        </div>
                        <div className="text-center">
                          <p className="text-foreground font-medium">Click to upload</p>
                          <p className="text-sm text-muted-foreground mt-1">or drag and drop</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Camera className="w-4 h-4" />
                          <span>Front-facing photo recommended</span>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="relative aspect-[3/4] bg-card">
                      <img
                        src={showResult ? selectedProduct.image : selectedImage}
                        alt={showResult ? "Try-on result" : "Your photo"}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Processing overlay */}
                      {isProcessing && (
                        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4">
                          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                          <p className="text-foreground font-medium">Processing your image...</p>
                          <p className="text-sm text-muted-foreground">AI magic happening</p>
                        </div>
                      )}

                      {/* Result overlay */}
                      {showResult && !isProcessing && (
                        <div className="absolute top-4 left-4 right-4 flex justify-between">
                          <span className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
                            Try-On Result
                          </span>
                          <Button variant="secondary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Save
                          </Button>
                        </div>
                      )}

                      {/* Reset button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-4 right-4"
                        onClick={resetTryOn}
                      >
                        Upload New
                      </Button>
                    </div>
                  )}
                </div>

                {/* Try On Button */}
                <Button
                  variant="hero"
                  className="w-full"
                  disabled={!selectedImage || isProcessing}
                  onClick={handleTryOn}
                >
                  {isProcessing ? 'Processing...' : 'Try On Selected Tee'}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Right: Product Selection */}
              <div className="space-y-6">
                <h2 className="font-display text-3xl">2. SELECT A T-SHIRT</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowResult(false);
                      }}
                      className={`relative aspect-[3/4] bg-card overflow-hidden transition-all duration-300 ${
                        selectedProduct.id === product.id
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : 'hover:ring-1 hover:ring-border'
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-3">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">${product.price}</p>
                      </div>
                      {selectedProduct.id === product.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Selected Product Info */}
                <div className="bg-card p-6 border border-border">
                  <div className="flex gap-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-display text-xl">{selectedProduct.name}</h3>
                      {selectedProduct.designer && (
                        <p className="text-sm text-muted-foreground">by {selectedProduct.designer}</p>
                      )}
                      <p className="text-primary font-medium mt-1">${selectedProduct.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-display text-lg mb-2">USE GOOD LIGHTING</h4>
                <p className="text-sm text-muted-foreground">Natural light works best for accurate results</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-display text-lg mb-2">FACE THE CAMERA</h4>
                <p className="text-sm text-muted-foreground">Front-facing photos provide the best fit preview</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-display text-lg mb-2">AI MAGIC</h4>
                <p className="text-sm text-muted-foreground">Our AI adapts the tee to your body shape</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default VirtualTryOnPage;
