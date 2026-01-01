import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Upload, Type, Trash2, RotateCw, ZoomIn, ZoomOut, Save, ShoppingCart,
    Move, Loader2, Image as ImageIcon, GripVertical
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import apiService from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

interface DesignElement {
    id: string;
    type: 'image' | 'text';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    color?: string;
    side: 'front' | 'back';
}

type ShirtStyle = 'sleeveless' | 'half-sleeve' | 'full-sleeve';

const SHIRT_STYLES: { id: ShirtStyle; name: string }[] = [
    { id: 'sleeveless', name: 'Sleeveless' },
    { id: 'half-sleeve', name: 'Half Sleeve' },
    { id: 'full-sleeve', name: 'Full Sleeve' },
];

// Shirt image paths - PNG images for each style and side
const SHIRT_IMAGES: Record<ShirtStyle, { front: string; back: string }> = {
    'sleeveless': {
        front: '/assets/shirts/sleeveless-front.png',
        back: '/assets/shirts/sleeveless-back.png',
    },
    'half-sleeve': {
        front: '/assets/shirts/half-sleeve-front.png',
        back: '/assets/shirts/half-sleeve-back.png',
    },
    'full-sleeve': {
        front: '/assets/shirts/full-sleeve-front.png',
        back: '/assets/shirts/full-sleeve-back.png',
    },
};

export default function CustomDesignPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const frontCanvasRef = useRef<HTMLDivElement>(null);
    const backCanvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [shirtStyle, setShirtStyle] = useState<ShirtStyle>('half-sleeve');
    const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
    const [elements, setElements] = useState<DesignElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [movingElement, setMovingElement] = useState<string | null>(null); // Element in move mode
    const [designName, setDesignName] = useState('My Custom Design');
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [baseProduct, setBaseProduct] = useState<any>(null);
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const frontElements = elements.filter(e => e.side === 'front');
    const backElements = elements.filter(e => e.side === 'back');

    useEffect(() => {
        loadBaseProduct();
    }, []);

    const loadBaseProduct = async () => {
        try {
            const response = await apiService.getCustomTshirtProduct();
            setBaseProduct(response.product);
        } catch (error) {
            console.error('Failed to load base product:', error);
        }
    };

    const addElement = (type: DesignElement['type'], content: string, color?: string) => {
        const newElement: DesignElement = {
            id: Date.now().toString(),
            type,
            content,
            x: 80,
            y: 120,
            width: type === 'text' ? 120 : 80,
            height: type === 'text' ? 40 : 80,
            rotation: 0,
            color,
            side: activeSide,
        };
        setElements([...elements, newElement]);
        setSelectedElement(newElement.id);
        setMovingElement(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            addElement('image', reader.result as string);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addTextElement = () => {
        const text = prompt('Enter your text:', 'Your Text Here');
        if (text) addElement('text', text, '#000000');
    };

    const deleteSelectedElement = () => {
        if (!selectedElement) return;
        setElements(elements.filter(el => el.id !== selectedElement));
        setSelectedElement(null);
        setMovingElement(null);
    };

    const rotateSelectedElement = () => {
        if (!selectedElement) return;
        setElements(elements.map(el =>
            el.id === selectedElement ? { ...el, rotation: (el.rotation + 45) % 360 } : el
        ));
    };

    const resizeSelectedElement = (scale: number) => {
        if (!selectedElement) return;
        setElements(elements.map(el =>
            el.id === selectedElement ? {
                ...el,
                width: Math.max(30, el.width * scale),
                height: Math.max(30, el.height * scale)
            } : el
        ));
    };

    // First click: select element and show controls
    // Second click or click on move button: enable movement
    const handleElementClick = (e: React.MouseEvent, elementId: string, side: 'front' | 'back') => {
        e.stopPropagation();
        setActiveSide(side);

        if (selectedElement === elementId) {
            // Second click - enable moving mode
            setMovingElement(elementId);
        } else {
            // First click - just select
            setSelectedElement(elementId);
            setMovingElement(null);
        }
    };

    const enableMoveMode = () => {
        if (selectedElement) {
            setMovingElement(selectedElement);
        }
    };

    const handleMouseDown = (e: React.MouseEvent, elementId: string, side: 'front' | 'back') => {
        e.stopPropagation();

        // Only allow dragging if element is in move mode
        if (movingElement !== elementId) {
            handleElementClick(e, elementId, side);
            return;
        }

        setDragging(true);
        const element = elements.find(el => el.id === elementId);
        const canvasRef = side === 'front' ? frontCanvasRef : backCanvasRef;
        if (element && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left - element.x,
                y: e.clientY - rect.top - element.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent, side: 'front' | 'back') => {
        if (!dragging || !movingElement) return;
        const canvasRef = side === 'front' ? frontCanvasRef : backCanvasRef;
        if (!canvasRef.current) return;

        const element = elements.find(el => el.id === movingElement);
        if (!element || element.side !== side) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width - element.width, e.clientX - rect.left - dragOffset.x));
        const y = Math.max(0, Math.min(rect.height - element.height, e.clientY - rect.top - dragOffset.y));
        setElements(elements.map(el =>
            el.id === movingElement ? { ...el, x, y } : el
        ));
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleCanvasClick = (side: 'front' | 'back') => {
        setActiveSide(side);
        setSelectedElement(null);
        setMovingElement(null);
    };

    const handleSaveDesign = async () => {
        if (!isAuthenticated) {
            toast({ title: 'Login Required', description: 'Please login to save your design', variant: 'destructive' });
            navigate('/auth?mode=login');
            return;
        }

        setSaving(true);
        try {
            await apiService.createCustomDesign({
                name: designName,
                frontDesign: frontElements,
                backDesign: backElements,
            });
            toast({ title: 'Success', description: 'Design saved successfully!' });
            setSaveDialogOpen(false);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Failed to save design', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    const handleAddToCart = async () => {
        if (!baseProduct) {
            toast({ title: 'Error', description: 'Base product not available', variant: 'destructive' });
            return;
        }

        let designId = null;
        if (isAuthenticated) {
            try {
                const response = await apiService.createCustomDesign({
                    name: designName,
                    frontDesign: frontElements,
                    backDesign: backElements,
                });
                designId = response.design.id;
            } catch (error) {
                console.error('Failed to save design:', error);
            }
        }

        const product = {
            id: String(baseProduct.id),
            name: `Custom Compression Shirt (${SHIRT_STYLES.find(s => s.id === shirtStyle)?.name}) - ${designName}`,
            price: baseProduct.price,
            image: baseProduct.image,
            customDesignId: designId,
            shirtStyle: shirtStyle,
        };

        addToCart(product, 'M', 'White', 1);
        toast({ title: 'Added to Cart', description: 'Your custom design has been added to cart' });
        navigate('/cart');
    };

    const renderElement = (element: DesignElement) => {
        const isSelected = selectedElement === element.id;
        const isMoving = movingElement === element.id;

        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `rotate(${element.rotation}deg)`,
            cursor: isMoving ? 'grab' : 'pointer',
            border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            zIndex: isSelected ? 10 : 1,
            boxShadow: isMoving ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
        };

        // Inline controls when selected but not moving
        const showInlineControls = isSelected && !isMoving;

        return (
            <div
                key={element.id}
                style={baseStyle}
                onMouseDown={(e) => handleMouseDown(e, element.id, element.side)}
            >
                {element.type === 'image' ? (
                    <img src={element.content} alt="" className="w-full h-full object-contain" draggable={false} />
                ) : (
                    <span style={{ color: element.color, fontWeight: 'bold', fontSize: '16px' }}>
                        {element.content}
                    </span>
                )}

                {/* Inline controls overlay */}
                {showInlineControls && (
                    <div
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1 bg-background border rounded-lg shadow-lg p-1 z-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); enableMoveMode(); }}
                            title="Move"
                        >
                            <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); rotateSelectedElement(); }}
                            title="Rotate"
                        >
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); resizeSelectedElement(1.2); }}
                            title="Larger"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); resizeSelectedElement(0.8); }}
                            title="Smaller"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); deleteSelectedElement(); }}
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Moving indicator */}
                {isMoving && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Drag to move
                    </div>
                )}
            </div>
        );
    };

    const renderCanvas = (side: 'front' | 'back') => {
        const canvasRef = side === 'front' ? frontCanvasRef : backCanvasRef;
        const sideElements = elements.filter(e => e.side === side);
        const isActive = activeSide === side;
        const shirtImage = SHIRT_IMAGES[shirtStyle][side];

        return (
            <div className="flex flex-col items-center">
                <h3 className={`text-sm font-medium mb-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {side === 'front' ? 'FRONT' : 'BACK'}
                </h3>
                <div
                    ref={canvasRef}
                    className={`relative rounded-xl transition-all overflow-hidden ${isActive
                        ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
                        : 'ring-1 ring-border shadow hover:ring-primary/50'
                        }`}
                    style={{
                        width: '320px',
                        height: '420px',
                        background: '#f8f8f8',
                    }}
                    onMouseMove={(e) => handleMouseMove(e, side)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={() => handleCanvasClick(side)}
                >
                    {/* Shirt PNG Image */}
                    <img
                        src={shirtImage}
                        alt={`${shirtStyle} ${side}`}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        draggable={false}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />

                    {/* Design Area Overlay */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            left: '80px',
                            top: '100px',
                            width: '160px',
                            height: '200px',
                        }}
                    >
                        {sideElements.length === 0 && isActive && (
                            <div className="w-full h-full border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center bg-white/20">
                                <span className="text-xs text-primary/50 text-center px-2">
                                    Add your design here
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Render design elements */}
                    {sideElements.map(renderElement)}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-display">Design Your Custom Compression Shirt</h1>
                        <p className="text-muted-foreground">Create your unique design with our easy-to-use editor</p>
                    </div>

                    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                        {/* Left Panel - Design Tools */}
                        <div className="space-y-4">
                            {/* Shirt Style Selector */}
                            <Card className="bg-card border-border">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3">Shirt Style</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {SHIRT_STYLES.map((style) => (
                                            <Button
                                                key={style.id}
                                                variant={shirtStyle === style.id ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setShirtStyle(style.id)}
                                                className="text-xs"
                                            >
                                                {style.name}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Active Side Indicator */}
                            <Card className="bg-primary/5 border-primary/20">
                                <CardContent className="p-4">
                                    <p className="text-sm text-center">
                                        Editing: <span className="font-bold text-primary uppercase">{activeSide}</span> side
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Upload Image */}
                            <Card className="bg-card border-border">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <Upload className="h-4 w-4" /> Upload Image
                                    </h3>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Choose Image
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Add Text */}
                            <Card className="bg-card border-border">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <Type className="h-4 w-4" /> Add Text
                                    </h3>
                                    <Button variant="outline" className="w-full" onClick={addTextElement}>
                                        Add Text Element
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Instructions */}
                            <Card className="bg-muted/50 border-muted">
                                <CardContent className="p-4">
                                    <h3 className="font-medium mb-2 text-sm">How to Use</h3>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>• Click element to select & show controls</li>
                                        <li>• Click move icon or element again to drag</li>
                                        <li>• Use controls to rotate, resize, or delete</li>
                                        <li>• Click outside element to deselect</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Price Info */}
                            {baseProduct && (
                                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                                    <CardContent className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground">Custom Compression Shirt Price</p>
                                        <p className="text-3xl font-bold text-primary">${baseProduct.price}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Panel - Canvas Area */}
                        <div className="space-y-6">
                            {/* Front and Back Side by Side */}
                            <div className="flex justify-center gap-8 flex-wrap">
                                {renderCanvas('front')}
                                {renderCanvas('back')}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-4">
                                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Save className="h-4 w-4" /> Save Design
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Save Your Design</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="designName">Design Name</Label>
                                                <Input
                                                    id="designName"
                                                    value={designName}
                                                    onChange={(e) => setDesignName(e.target.value)}
                                                    placeholder="Enter design name..."
                                                    className="mt-1"
                                                />
                                            </div>
                                            <Button onClick={handleSaveDesign} className="w-full" disabled={saving}>
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save Design'
                                                )}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Button onClick={handleAddToCart} className="gap-2">
                                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
