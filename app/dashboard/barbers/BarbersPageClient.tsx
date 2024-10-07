"use client";

import {useState, useEffect} from "react";
import {Search, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Database} from "@/database.types";
import {
  addBarber,
  updateBarber,
  deleteBarber,
  addServiceToBarber,
  removeServiceFromBarber,
  getNonBarberProfiles,
  assignBarberRole,
} from "@/app/actions/dashboard-actions";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import Link from "next/link";

type Barber = Database["public"]["Tables"]["barbers"]["Row"] & {services: Service[]};
type Service = Database["public"]["Tables"]["services"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function BarbersPageClient({
  initialBarbers,
  initialServices,
  refreshBarbers,
}: {
  initialBarbers: Barber[];
  initialServices: Service[];
  refreshBarbers: () => Promise<Barber[]>;
}) {
  const router = useRouter();
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBarber, setNewBarber] = useState<Omit<Barber, "id" | "user_id">>({
    name: "",
    email: "",
    image: "",
    description: "",
    services: [],
  });
  const [selectedServices, setSelectedServices] = useState<Record<number, string | null>>({});
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [profileSearchTerm, setProfileSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [isAddBarberDialogOpen, setIsAddBarberDialogOpen] = useState(false);

  const filteredBarbers = barbers.filter(
    (barber) => barber.name.toLowerCase().includes(searchTerm.toLowerCase()) || barber.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchProfiles = async () => {
      const fetchedProfiles = await getNonBarberProfiles();
      setProfiles(fetchedProfiles);
      setFilteredProfiles(fetchedProfiles);
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    const filtered = profiles.filter(
      (profile) =>
        profile.full_name?.toLowerCase().includes(profileSearchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(profileSearchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
  }, [profileSearchTerm, profiles]);

  const handleAddBarber = async () => {
    if (!selectedProfile) return;

    try {
      await assignBarberRole(selectedProfile.id, selectedServiceIds);
      const updatedBarbers = await refreshBarbers();
      setBarbers(updatedBarbers);
      setIsAddBarberDialogOpen(false);
      setSelectedProfile(null);
      setSelectedServiceIds([]);
      toast({
        title: "Barber added",
        description: `${selectedProfile.full_name} has been assigned the barber role.`,
      });
    } catch (error) {
      console.error("Error adding barber:", error);
      toast({
        title: "Error",
        description: "Failed to add barber. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveService = async (barberId: number, serviceId: number) => {
    try {
      await removeServiceFromBarber(barberId, serviceId);
      const updatedBarbers = await refreshBarbers();
      setBarbers(updatedBarbers);
      toast({
        title: "Service removed",
        description: `Service has been removed from the barber's services.`,
      });
    } catch (error) {
      console.error("Error removing service:", error);
      toast({
        title: "Error",
        description: "Failed to remove service. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddService = async (barberId: number) => {
    const selectedService = selectedServices[barberId];
    if (!selectedService) return;

    try {
      await addServiceToBarber(barberId, parseInt(selectedService));
      const updatedBarbers = await refreshBarbers();
      setBarbers(updatedBarbers);
      setSelectedServices((prev) => ({...prev, [barberId]: null})); // Reset selected service after adding
      toast({
        title: "Service added",
        description: `Service has been added to the barber's services.`,
      });
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb className="hidden md:flex mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Barbers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search barbers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
        </div>
        <Dialog open={isAddBarberDialogOpen} onOpenChange={setIsAddBarberDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Barber
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Barber</DialogTitle>
              <DialogDescription>Assign the barber role to an existing user.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Input
                  id="profile-search"
                  value={profileSearchTerm}
                  onChange={(e) => setProfileSearchTerm(e.target.value)}
                  placeholder="Search by name or email"
                  className="col-span-3"
                />
              </div>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {filteredProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`flex items-center justify-between p-2 cursor-pointer ${selectedProfile?.id === profile.id ? "bg-secondary" : ""}`}
                    onClick={() => setSelectedProfile(profile)}>
                    <div>
                      <p className="font-medium">{profile.full_name}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                    {selectedProfile?.id === profile.id && <Badge variant="outline">Selected</Badge>}
                  </div>
                ))}
              </ScrollArea>
              <div className="flex items-center gap-4">
                <Label htmlFor="services" className="text-right">
                  Services
                </Label>
                <Select onValueChange={(value) => setSelectedServiceIds([...selectedServiceIds, parseInt(value)])}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select services" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 flex flex-wrap gap-2">
                {selectedServiceIds.map((serviceId) => {
                  const service = services.find((s) => s.id === serviceId);
                  return (
                    <Badge key={serviceId} variant="secondary" className="flex items-center gap-1">
                      {service?.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => setSelectedServiceIds(selectedServiceIds.filter((id) => id !== serviceId))}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBarber} disabled={!selectedProfile}>
                Assign Barber Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarbers.map((barber) => (
          <Card key={barber.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={barber.image || undefined} alt={barber.name || ""} />
                  <AvatarFallback>
                    {barber.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{barber.name}</CardTitle>
                  <CardDescription>{barber.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <Label className="text-sm font-semibold">Services</Label>
              <ScrollArea className="h-[100px] w-full rounded-md border p-2 mt-2">
                <div className="flex flex-wrap gap-2">
                  {barber.services.map((service) => (
                    <Badge key={service.id} variant="secondary" className="flex items-center gap-1">
                      {service.name}
                      <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full" onClick={() => handleRemoveService(barber.id, service.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="flex w-full space-x-2">
                <Select
                  value={selectedServices[barber.id] || ""}
                  onValueChange={(value) => setSelectedServices((prev) => ({...prev, [barber.id]: value}))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a service to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {services
                      .filter((service) => !barber.services.some((s) => s.id === service.id))
                      .map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => handleAddService(barber.id)} disabled={!selectedServices[barber.id]}>
                  Add Service
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
