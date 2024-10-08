"use client";

import {useState} from "react";
import {Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {CalendarIcon, TrendingUpIcon, ScissorsIcon, DollarSignIcon, UsersIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// Mock data (same as before)
const appointmentData = [
  {day: "Mon", appointments: 15},
  {day: "Tue", appointments: 20},
  {day: "Wed", appointments: 25},
  {day: "Thu", appointments: 18},
  {day: "Fri", appointments: 30},
  {day: "Sat", appointments: 35},
  {day: "Sun", appointments: 10},
];

const appointmentStatusData = [
  {status: "Completed", value: 80},
  {status: "Cancelled", value: 15},
  {status: "No-show", value: 5},
];

const revenueData = [
  {month: "Jan", revenue: 5000},
  {month: "Feb", revenue: 5500},
  {month: "Mar", revenue: 6000},
  {month: "Apr", revenue: 6200},
  {month: "May", revenue: 6800},
  {month: "Jun", revenue: 7200},
];

const revenueByServiceData = [
  {service: "Haircut", revenue: 4000},
  {service: "Beard Trim", revenue: 2000},
  {service: "Hair Coloring", revenue: 3000},
  {service: "Shaving", revenue: 1500},
];

const yearOverYearData = [
  {month: "Jan", "2022": 4000, "2023": 5000},
  {month: "Feb", "2022": 4200, "2023": 5500},
  {month: "Mar", "2022": 4800, "2023": 6000},
  {month: "Apr", "2022": 5000, "2023": 6200},
  {month: "May", "2022": 5500, "2023": 6800},
  {month: "Jun", "2022": 6000, "2023": 7200},
];

export default function BarberShopBentoAnalytics() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Barbershop Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-4">
        <Card className="md:col-span-2 md:row-span-2">
          <CardHeader>
            <CardTitle>Appointment Statistics</CardTitle>
            <CardDescription>Total appointments per {timeRange}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{appointments: {label: "Appointments", color: "hsl(var(--chart-1))"}}} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="appointments" fill="var(--color-appointments)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: {label: "Completed", color: "hsl(var(--chart-1))"},
                cancelled: {label: "Cancelled", color: "hsl(var(--chart-2))"},
                noShow: {label: "No-show", color: "hsl(var(--chart-3))"},
              }}
              className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="var(--color-completed)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$34,700</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Service Value</CardTitle>
            <ScissorsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42.50</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>{timeRange}ly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{revenue: {label: "Revenue", color: "hsl(var(--chart-1))"}}} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Year-over-Year Revenue Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                "2022": {label: "2022", color: "hsl(var(--chart-1))"},
                "2023": {label: "2023", color: "hsl(var(--chart-2))"},
              }}
              className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearOverYearData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="2022" stroke="var(--color-2022)" />
                  <Line type="monotone" dataKey="2023" stroke="var(--color-2023)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Revenue by Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                haircut: {label: "Haircut", color: "hsl(var(--chart-1))"},
                beardTrim: {label: "Beard Trim", color: "hsl(var(--chart-2))"},
                hairColoring: {label: "Hair Coloring", color: "hsl(var(--chart-3))"},
                shaving: {label: "Shaving", color: "hsl(var(--chart-4))"},
              }}
              className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByServiceData}>
                  <XAxis dataKey="service" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-haircut)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
