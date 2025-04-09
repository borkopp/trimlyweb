"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"

export function AnalyticsPage() {
  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 px-6 sm:flex-row sm:px-8">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Today</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              32{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                appointments
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                haircuts: {
                  label: "Appointments",
                  color: "hsl(var(--primary))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={[
                  { date: "2024-01-01", haircuts: 25 },
                  { date: "2024-01-02", haircuts: 28 },
                  { date: "2024-01-03", haircuts: 30 },
                  { date: "2024-01-04", haircuts: 22 },
                  { date: "2024-01-05", haircuts: 35 },
                  { date: "2024-01-06", haircuts: 40 },
                  { date: "2024-01-07", haircuts: 32 },
                ]}
              >
                <Bar
                  dataKey="haircuts"
                  fill="var(--color-haircuts)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={30}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label
                    position="insideBottomLeft"
                    value="Average Haircuts"
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                  <Label
                    position="insideTopLeft"
                    value="30"
                    className="text-lg"
                    fill="hsl(var(--foreground))"
                    offset={10}
                    startOffset={100}
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              Over the past 7 days, you have performed{" "}
              <span className="font-medium text-foreground">212</span> haircuts.
            </CardDescription>
            <CardDescription>
              You need{" "}
              <span className="font-medium text-foreground">18</span> more
              haircuts to reach your weekly goal.
            </CardDescription>
          </CardFooter>
        </Card>
        <Card className="flex flex-col lg:max-w-md">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
            <div>
              <CardDescription>Average Wait Time</CardDescription>
              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                15
                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                  min
                </span>
              </CardTitle>
            </div>
            <div>
              <CardDescription>Customer Satisfaction</CardDescription>
              <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                4.8
                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                  / 5
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ChartContainer
              config={{
                waitTime: {
                  label: "Wait Time",
                  color: "hsl(var(--primary))",
                },
              }}
              className="w-full"
            >
              <LineChart
                accessibilityLayer
                margin={{
                  left: 14,
                  right: 14,
                  top: 10,
                }}
                data={[
                  { date: "2024-01-01", waitTime: 20 },
                  { date: "2024-01-02", waitTime: 18 },
                  { date: "2024-01-03", waitTime: 15 },
                  { date: "2024-01-04", waitTime: 12 },
                  { date: "2024-01-05", waitTime: 10 },
                  { date: "2024-01-06", waitTime: 14 },
                  { date: "2024-01-07", waitTime: 15 },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                />
                <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  }}
                />
                <Line
                  dataKey="waitTime"
                  type="natural"
                  fill="var(--color-waitTime)"
                  stroke="var(--color-waitTime)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    fill: "var(--color-waitTime)",
                    stroke: "var(--color-waitTime)",
                    r: 4,
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                  cursor={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>
              You&apos;re averaging more haircuts per day this year than last year.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                32
                <span className="text-sm font-normal text-muted-foreground">
                  appointments/day
                </span>
              </div>
              <ChartContainer
                config={{
                  haircuts: {
                    label: "Haircuts",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="aspect-auto h-[32px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      date: "2024",
                      haircuts: 32,
                    },
                  ]}
                >
                  <Bar
                    dataKey="haircuts"
                    fill="var(--color-haircuts)"
                    radius={4}
                    barSize={32}
                  >
                    <LabelList
                      position="insideLeft"
                      dataKey="date"
                      offset={8}
                      fontSize={12}
                      fill="white"
                    />
                  </Bar>
                  <YAxis dataKey="date" type="category" tickCount={1} hide />
                  <XAxis dataKey="haircuts" type="number" hide />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                28
                <span className="text-sm font-normal text-muted-foreground">
                  haircuts/day
                </span>
              </div>
              <ChartContainer
                config={{
                  haircuts: {
                    label: "Haircuts",
                    color: "hsl(var(--muted))",
                  },
                }}
                className="aspect-auto h-[32px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  layout="vertical"
                  margin={{
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  data={[
                    {
                      date: "2023",
                      haircuts: 28,
                    },
                  ]}
                >
                  <Bar
                    dataKey="haircuts"
                    fill="var(--color-haircuts)"
                    radius={4}
                    barSize={32}
                  >
                    <LabelList
                      position="insideLeft"
                      dataKey="date"
                      offset={8}
                      fontSize={12}
                      fill="hsl(var(--muted-foreground))"
                    />
                  </Bar>
                  <YAxis dataKey="date" type="category" tickCount={1} hide />
                  <XAxis dataKey="haircuts" type="number" hide />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-xs">
          <CardHeader className="p-4 pb-0">
            <CardTitle>Service Duration</CardTitle>
            <CardDescription>
              Over the last 7 days, your average haircut duration was 25 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              25
              <span className="text-sm font-normal text-muted-foreground">
                min/haircut
              </span>
            </div>
            <ChartContainer
              config={{
                duration: {
                  label: "Duration",
                  color: "hsl(var(--primary))",
                },
              }}
              className="ml-auto w-[72px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  { date: "2024-01-01", duration: 28 },
                  { date: "2024-01-02", duration: 26 },
                  { date: "2024-01-03", duration: 24 },
                  { date: "2024-01-04", duration: 22 },
                  { date: "2024-01-05", duration: 25 },
                  { date: "2024-01-06", duration: 27 },
                  { date: "2024-01-07", duration: 25 },
                ]}
              >
                <Bar
                  dataKey="duration"
                  fill="var(--color-duration)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="max-w-xs">
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={{
                haircuts: {
                  label: "Haircuts",
                  color: "hsl(var(--chart-1))",
                },
                beardTrim: {
                  label: "Beard Trim",
                  color: "hsl(var(--chart-2))",
                },
                styling: {
                  label: "Hair Wash",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[140px] w-full"
            >
              <BarChart
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  
                  bottom: 10,
                }}
                data={[
                  {
                    activity: "styling",
                    value: (15 / 50) * 100,
                    label: "15/50",
                    fill: "var(--color-styling)",
                  },
                  {
                    activity: "beardTrim",
                    value: (22 / 50) * 100,
                    label: "22/50",
                    fill: "var(--color-beardTrim)",
                  },
                  {
                    activity: "haircuts",
                    value: (32 / 50) * 100,
                    label: "32/50",
                    fill: "var(--color-haircuts)",
                  },
                ]}
                layout="vertical"
                barSize={32}
                barGap={2}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="activity"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  axisLine={false}
                  className="capitalize"
                />
                <Bar dataKey="value" radius={5}>
                  <LabelList
                    position="insideLeft"
                    dataKey="label"
                    fill="black"
                    offset={8}
                    fontSize={12}
                    fontWeight={600}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-row border-t p-4">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Haircuts</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  32
                  <span className="text-sm font-normal text-muted-foreground">
                    /50
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Beard Trim</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  22
                  <span className="text-sm font-normal text-muted-foreground">
                    /50
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Hair Wash</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  15
                  <span className="text-sm font-normal text-muted-foreground">
                    /50
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6">
        <Card className="max-w-xs">
          <CardContent className="flex gap-4 p-4">
            <div className="grid items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Haircuts</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  32/50
                  <span className="text-sm font-normal text-muted-foreground">
                    daily goal
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Beard Trims</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  22/30
                  <span className="text-sm font-normal text-muted-foreground">
                    daily goal
                  </span>
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Hair Wash</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  15/20
                  <span className="text-sm font-normal text-muted-foreground">
                    daily goal
                  </span>
                </div>
              </div>
            </div>
            <ChartContainer
              config={{
                haircuts: {
                  label: "Haircuts",
                  color: "hsl(var(--chart-1))",
                },
                beardTrim: {
                  label: "Beard Trim",
                  color: "hsl(var(--chart-2))",
                },
                styling: {
                  label: "Hair Wash",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="mx-auto aspect-square w-full max-w-[80%]"
            >
              <RadialBarChart
                margin={{
                  left: -10,
                  right: -10,
                  top: -10,
                  bottom: -10,
                }}
                data={[
                  {
                    activity: "styling",
                    value: (15 / 20) * 100,
                    fill: "var(--color-styling)",
                  },
                  {
                    activity: "beardTrim",
                    value: (22 / 30) * 100,
                    fill: "var(--color-beardTrim)",
                  },
                  {
                    activity: "haircuts",
                    value: (32 / 50) * 100,
                    fill: "var(--color-haircuts)",
                  },
                ]}
                innerRadius="20%"
                barSize={24}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar dataKey="value" background cornerRadius={5} />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="max-w-xs">
          <CardHeader className="p-4 pb-0">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              You&apos;re earning an average of $1,254 per day. Great job!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
            <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
              $1,254
              <span className="text-sm font-normal text-muted-foreground">
                /day
              </span>
            </div>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="ml-auto w-[64px]"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                data={[
                  { date: "2024-01-01", revenue: 1100 },
                  { date: "2024-01-02", revenue: 1250 },
                  { date: "2024-01-03", revenue: 1400 },
                  { date: "2024-01-04", revenue: 1150 },
                  { date: "2024-01-05", revenue: 1300 },
                  { date: "2024-01-06", revenue: 1500 },
                  { date: "2024-01-07", revenue: 1254 },
                ]}
              >
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={2}
                  fillOpacity={0.2}
                  activeIndex={6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  hide
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="max-w-xs">
          <CardHeader className="space-y-0 pb-0">
            <CardDescription>Appointments</CardDescription>
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              42
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                booked
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                appointments: {
                  label: "Appointments",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <AreaChart
                accessibilityLayer
                data={[
                  { date: "2024-01-01", appointments: 35 },
                  { date: "2024-01-02", appointments: 38 },
                  { date: "2024-01-03", appointments: 40 },
                  { date: "2024-01-04", appointments: 32 },
                  { date: "2024-01-05", appointments: 36 },
                  { date: "2024-01-06", appointments: 45 },
                  { date: "2024-01-07", appointments: 42 },
                ]}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="date" hide />
                <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
                <defs>
                  <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-appointments)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-appointments)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="appointments"
                  type="natural"
                  fill="url(#fillAppointments)"
                  fillOpacity={0.4}
                  stroke="var(--color-appointments)"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => (
                    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                      Appointments
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          booked
                        </span>
                      </div>
                    </div>
                  )}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}