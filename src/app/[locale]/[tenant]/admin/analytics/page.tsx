"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Eye, QrCode, Clock, Users } from "lucide-react"

const viewsData = [
  { date: "Jan 1", views: 120 },
  { date: "Jan 2", views: 145 },
  { date: "Jan 3", views: 132 },
  { date: "Jan 4", views: 168 },
  { date: "Jan 5", views: 189 },
  { date: "Jan 6", views: 201 },
  { date: "Jan 7", views: 178 },
]

const qrScansData = [
  { date: "Jan 1", scans: 45 },
  { date: "Jan 2", scans: 52 },
  { date: "Jan 3", scans: 48 },
  { date: "Jan 4", scans: 61 },
  { date: "Jan 5", scans: 73 },
  { date: "Jan 6", scans: 68 },
  { date: "Jan 7", scans: 59 },
]

const popularItemsData = [
  { name: "Grilled Salmon", views: 342 },
  { name: "Beef Wellington", views: 298 },
  { name: "Lobster Risotto", views: 276 },
  { name: "Caesar Salad", views: 234 },
  { name: "Chocolate Cake", views: 198 },
]

const trafficSourcesData = [
  { source: "QR Code", visits: 1234 },
  { source: "Direct", visits: 892 },
  { source: "Social Media", visits: 456 },
  { source: "Search", visits: 265 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your restaurant&apos;s performance and customer engagement</p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+8.2%</span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 24s</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+0.5s</span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span className="text-green-600">-2.1%</span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views" className="space-y-6">
        <TabsList>
          <TabsTrigger value="views">Page Views</TabsTrigger>
          <TabsTrigger value="scans">QR Scans</TabsTrigger>
          <TabsTrigger value="items">Popular Items</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Page Views Over Time</CardTitle>
              <CardDescription>Daily page views for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scans">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Scans Over Time</CardTitle>
              <CardDescription>Daily QR code scans for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  scans: {
                    label: "Scans",
                    color: "hsl(var(--accent))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={qrScansData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="scans" stroke="var(--color-scans)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Menu Items</CardTitle>
              <CardDescription>Top viewed items in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularItemsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" fill="var(--color-views)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  visits: {
                    label: "Visits",
                    color: "hsl(var(--accent))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficSourcesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="visits" fill="var(--color-visits)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>When your customers are most active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "12:00 PM - 2:00 PM", percentage: 85, label: "Lunch Rush" },
                { time: "6:00 PM - 9:00 PM", percentage: 92, label: "Dinner Peak" },
                { time: "3:00 PM - 5:00 PM", percentage: 45, label: "Afternoon" },
                { time: "9:00 PM - 11:00 PM", percentage: 38, label: "Late Evening" },
              ].map((period, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{period.time}</span>
                    <span className="text-muted-foreground">{period.label}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${period.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>How customers access your menu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { device: "Mobile", percentage: 68, count: "1,936 visits" },
                { device: "Desktop", percentage: 24, count: "683 visits" },
                { device: "Tablet", percentage: 8, count: "228 visits" },
              ].map((device, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{device.device}</span>
                    <span className="text-muted-foreground">{device.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-accent transition-all" style={{ width: `${device.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
