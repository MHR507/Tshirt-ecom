import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { currentDesigner, designerSalesData, getDesignerDesigns } from '@/data/adminData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function DesignerSales() {
  const designerDesigns = getDesignerDesigns(currentDesigner.id).filter(d => d.status === 'approved');
  const totalSales = designerDesigns.reduce((sum, d) => sum + d.sales, 0);
  const totalRevenue = designerDesigns.reduce((sum, d) => sum + d.revenue, 0);
  const commission = totalRevenue * 0.05;

  // Mock sales by design data
  const salesByDesign = designerDesigns.map(d => ({
    name: d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name,
    sales: d.sales,
    earnings: d.revenue * 0.05
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">Sales Analytics</h1>
        <p className="text-muted-foreground">Track your design performance and earnings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSales}</p>
                <p className="text-sm text-muted-foreground">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${commission.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Your Earnings (5%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(commission / 6).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Avg. Monthly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Monthly Earnings Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={designerSalesData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Sales by Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByDesign} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Performance Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Design Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Design</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Sales</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue Generated</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Your Earnings (5%)</th>
                </tr>
              </thead>
              <tbody>
                {designerDesigns.map((design) => (
                  <tr key={design.id} className="border-b border-border/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={design.image} 
                          alt={design.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium">{design.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{design.sales}</td>
                    <td className="py-3 px-4 text-sm">${design.revenue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-accent">${(design.revenue * 0.05).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
