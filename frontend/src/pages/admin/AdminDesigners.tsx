import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Mail, Palette, DollarSign } from 'lucide-react';
import { useState } from 'react';

const designers = [
  {
    id: 'designer-1',
    name: 'Alex Rivera',
    email: 'alex@designer.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    totalDesigns: 12,
    approvedDesigns: 10,
    totalSales: 156,
    totalEarnings: 4250.50,
    joinDate: '2023-06-15',
    status: 'active'
  },
  {
    id: 'designer-2',
    name: 'Maya Chen',
    email: 'maya@designer.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    totalDesigns: 8,
    approvedDesigns: 7,
    totalSales: 98,
    totalEarnings: 2680.00,
    joinDate: '2023-08-20',
    status: 'active'
  },
  {
    id: 'designer-3',
    name: 'Jordan Lee',
    email: 'jordan@designer.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    totalDesigns: 5,
    approvedDesigns: 3,
    totalSales: 42,
    totalEarnings: 1150.25,
    joinDate: '2023-11-10',
    status: 'pending'
  }
];

export default function AdminDesigners() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDesigners = designers.filter(designer =>
    designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    designer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">Designers</h1>
        <p className="text-muted-foreground">Manage designer accounts and performance</p>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search designers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{designers.length}</p>
                <p className="text-sm text-muted-foreground">Total Designers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{designers.reduce((sum, d) => sum + d.approvedDesigns, 0)}</p>
                <p className="text-sm text-muted-foreground">Approved Designs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${designers.reduce((sum, d) => sum + d.totalEarnings, 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Designers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDesigners.map((designer) => (
          <Card key={designer.id} className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <img 
                  src={designer.avatar} 
                  alt={designer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{designer.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      designer.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {designer.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {designer.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Joined: {designer.joinDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-primary">{designer.approvedDesigns}</p>
                  <p className="text-xs text-muted-foreground">Designs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{designer.totalSales}</p>
                  <p className="text-xs text-muted-foreground">Sales</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Earnings</span>
                  <span className="font-bold text-green-500">${designer.totalEarnings.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                <Button size="sm" className="flex-1">View Designs</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
