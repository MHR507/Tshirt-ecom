import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, Upload, Eye, Edit, Trash2 } from 'lucide-react';
import { currentDesigner, getDesignerDesigns, Design } from '@/data/adminData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function DesignerDesigns() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const designerDesigns = getDesignerDesigns(currentDesigner.id);

  const getStatusColor = (status: Design['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Design submitted for review!');
    setShowUploadDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">My Designs</h1>
          <p className="text-muted-foreground">Manage your design portfolio</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload New Design
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit New Design</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="name">Design Name</Label>
                <Input id="name" placeholder="Enter design name" className="bg-background" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your design..." 
                  className="bg-background resize-none" 
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="abstract, minimal, modern" className="bg-background" />
              </div>
              <div>
                <Label>Design File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 10MB</p>
                  <p className="text-xs text-accent mt-2">High resolution (min 2000x2000px) recommended</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-medium mb-1">Commission Structure</p>
                <p className="text-muted-foreground">You earn 5% commission on every sale of your design. Designs are reviewed within 24-48 hours.</p>
              </div>
              <Button type="submit" className="w-full">Submit for Review</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{designerDesigns.length}</p>
                <p className="text-sm text-muted-foreground">Total Designs</p>
              </div>
              <Palette className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{designerDesigns.filter(d => d.status === 'approved').length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-lg">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{designerDesigns.filter(d => d.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-500 text-lg">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Designs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {designerDesigns.map((design) => (
          <Card key={design.id} className="bg-card border-border overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={design.image} 
                alt={design.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${getStatusColor(design.status)}`}>
                {design.status}
              </span>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{design.name}</h3>
              <p className="text-xs text-muted-foreground">Uploaded: {design.uploadDate}</p>
              
              {design.status === 'approved' && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Sales</span>
                    <span className="font-medium">{design.sales}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Your Earnings (5%)</span>
                    <span className="font-medium text-accent">${(design.revenue * 0.05).toFixed(2)}</span>
                  </div>
                </div>
              )}
              
              {design.status === 'rejected' && (
                <div className="mt-3 p-2 bg-red-500/10 rounded-lg">
                  <p className="text-xs text-red-400">Design did not meet our quality guidelines. Please review and resubmit.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
