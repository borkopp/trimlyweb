import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {AppointmentDetailsOverview} from "@/components/dashboard/AppointmentDetailsOverview";

export default function DashboardSkeleton() {
  return (
    <main className="grid flex-1 items-start gap-4 p-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Barbershop Overview</CardTitle>
              <CardDescription className="max-w-xl text-balance leading-relaxed">
                Manage appointments, clients, barbers and services with ease.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-10 w-[200px]" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today&apos;s Appointments</CardDescription>
              <Skeleton className="h-10 w-16 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[180px]" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-2 w-full" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Estimated Revenue</CardDescription>
              <Skeleton className="h-10 w-24 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-2 w-full" />
            </CardFooter>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <div className="flex gap-1">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-7 w-7" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-4 hidden space-y-4 lg:col-span-1 lg:block">
        <AppointmentDetailsOverview />
      </div>
    </main>
  );
}
