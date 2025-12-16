import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Search, Upload, Check, X, Eye } from 'lucide-react';
import { designs, Design } from '@/data/adminData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminDesigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.designerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || design.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Design['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleApprove = (designId: string) => {
    toast.success('Design approved successfully');
  };

  const handleReject = (designId: string) => {
    toast.error('Design rejected');
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Design uploaded successfully');
    setShowUploadDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Designs</h1>
          <p className="text-muted-foreground">Manage and approve designer submissions</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Design
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Design</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="name">Design Name</Label>
                <Input id="name" placeholder="Enter design name" className="bg-background" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Design File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>
              <Button type="submit" className="w-full">Upload Design</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Designs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDesigns.map((design) => (
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
              </div>
              <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${getStatusColor(design.status)}`}>
                {design.status}
              </span>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{design.name}</h3>
              <p className="text-sm text-muted-foreground">by {design.designerName}</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">Sales:</span> {design.sales}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Revenue:</span> ${design.revenue.toFixed(2)}
                </div>
              </div>
              {design.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 gap-1" onClick={() => handleApprove(design.id)}>
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1 gap-1" onClick={() => handleReject(design.id)}>
                    <X className="h-3 w-3" /> Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
