import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, DollarSign, TrendingUp, ShoppingBag, Wallet } from 'lucide-react';
import { currentDesigner, designerSalesData, getDesignerDesigns } from '@/data/adminData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function DesignerDashboard() {
  const designerDesigns = getDesignerDesigns(currentDesigner.id);
  const approvedDesigns = designerDesigns.filter(d => d.status === 'approved').length;
  const pendingDesigns = designerDesigns.filter(d => d.status === 'pending').length;

  const stats = [
    { title: 'Total Earnings', value: `$${currentDesigner.totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Wallet Balance', value: `$${currentDesigner.walletBalance.toFixed(2)}`, icon: Wallet, color: 'text-primary' },
    { title: 'Total Sales', value: currentDesigner.totalSales, icon: ShoppingBag, color: 'text-accent' },
    { title: 'Active Designs', value: approvedDesigns, icon: Palette, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">Welcome back, {currentDesigner.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's an overview of your design business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Earnings Overview (5% commission)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={designerSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent) / 0.2)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Designs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/designer/designs">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Palette className="h-4 w-4" />
                Upload New Design
              </Button>
            </Link>
            <Link to="/designer/wallet">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Wallet className="h-4 w-4" />
                Withdraw Earnings
              </Button>
            </Link>
            <Link to="/designer/sales">
              <Button className="w-full justify-start gap-2" variant="outline">
                <TrendingUp className="h-4 w-4" />
                View Sales Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Designs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {designerDesigns.slice(0, 3).map((design) => (
                <div key={design.id} className="flex items-center gap-4">
                  <img 
                    src={design.image} 
                    alt={design.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{design.name}</p>
                    <p className="text-xs text-muted-foreground">{design.sales} sales</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    design.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                    design.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {design.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Notification */}
      {pendingDesigns > 0 && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="flex items-center gap-4 py-4">
            <Palette className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="font-medium">You have {pendingDesigns} design(s) pending approval</p>
              <p className="text-sm text-muted-foreground">Our team is reviewing your submissions</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
