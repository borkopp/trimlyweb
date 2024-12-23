"use client";
import {useState, useEffect, useCallback} from "react";
import {Search, Plus, X, MoreVertical, Trash, User, Scissors} from "lucide-react";
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
import {addServiceToBarber, removeServiceFromBarber, getNonBarberProfiles, assignBarberRole, deleteBarber} from "@/app/actions/dashboard-actions";
import {toast} from "@/components/ui/use-toast";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {createClient} from "@/utils/supabase/client";
import {EmptyState} from "@/components/ui/empty-state";

type Barber = Database["public"]["Tables"]["barbers"]["Row"] & {services: Service[]};
type Service = Database["public"]["Tables"]["services"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

async function getImageUrl(path: string) {
  const supabase = createClient();
  const {data} = await supabase.storage.from("barber-images").getPublicUrl(path);
  return data?.publicUrl || null;
}

export default function BarbersPageClient({
  initialBarbers,
  initialServices,
  refreshBarbers,
}: {
  initialBarbers: Barber[];
  initialServices: Service[];
  refreshBarbers: () => Promise<Barber[]>;
}) {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState<Record<number, string | null>>({});
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [profileSearchTerm, setProfileSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [isAddBarberDialogOpen, setIsAddBarberDialogOpen] = useState(false);
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [barberAvatars, setBarberAvatars] = useState<Record<number, string | null>>({});
  const [addingServices, setAddingServices] = useState<Record<number, boolean>>({});
  const [isRemovingService, setIsRemovingService] = useState<Record<number, boolean>>({});

  const filteredBarbers = barbers.filter(
    (barber) => barber.name.toLowerCase().includes(searchTerm.toLowerCase()) || barber.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshNonBarberProfiles = useCallback(async () => {
    setIsLoadingProfiles(true);
    try {
      const fetchedProfiles = await getNonBarberProfiles();
      setProfiles(fetchedProfiles);
      setFilteredProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Error fetching non-barber profiles:", error);
      toast({
        title: "Error",
        description: "Failed to load non-barber profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfiles(false);
    }
  }, []);

  useEffect(() => {
    refreshNonBarberProfiles();
  }, [refreshNonBarberProfiles]);

  useEffect(() => {
    const loadBarberAvatars = async () => {
      const avatars: Record<number, string | null> = {};
      for (const barber of barbers) {
        if (barber.image) {
          avatars[barber.id] = await getImageUrl(barber.image);
        } else {
          avatars[barber.id] = null;
        }
      }
      setBarberAvatars(avatars);
    };
    loadBarberAvatars();
  }, [barbers]);

  useEffect(() => {
    const filtered = profiles.filter(
      (profile) =>
        profile.full_name?.toLowerCase().includes(profileSearchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(profileSearchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
  }, [profileSearchTerm, profiles]);

  useEffect(() => {
    const refreshBarbersList = async () => {
      const updatedBarbers = await refreshBarbers();
      setBarbers(updatedBarbers);
    };

    // Refresh the barbers list every 5 minutes
    const intervalId = setInterval(refreshBarbersList, 5 * 60 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshBarbers]);

  const handleAddBarber = async () => {
    if (!selectedProfile) return;
    setIsAddingBarber(true);

    try {
      await assignBarberRole(selectedProfile.id, selectedServiceIds);
      const updatedBarbers = await refreshBarbers();
      setBarbers(updatedBarbers);
      setIsAddBarberDialogOpen(false);

      // Update the profiles list
      setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== selectedProfile.id));
      setFilteredProfiles((prevFiltered) => prevFiltered.filter((profile) => profile.id !== selectedProfile.id));

      setSelectedProfile(null);
      setSelectedServiceIds([]);
      setProfileSearchTerm(""); // Clear the search term

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
    } finally {
      setIsAddingBarber(false);
    }
  };

  const handleRemoveService = async (barberId: number, serviceId: number) => {
    setIsRemovingService((prev) => ({...prev, [barberId]: true}));
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
    } finally {
      setIsRemovingService((prev) => ({...prev, [barberId]: false}));
    }
  };

  const handleAddService = async (barberId: number) => {
    const selectedService = selectedServices[barberId];
    if (!selectedService) return;

    // Set the adding state for this specific barber
    setAddingServices((prev) => ({...prev, [barberId]: true}));

    try {
      await addServiceToBarber(barberId, parseInt(selectedService));
      const updatedBarbers = await refreshBarbers();
      setBarbers(updatedBarbers);
      setSelectedServices((prev) => ({...prev, [barberId]: null}));
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
    } finally {
      // Reset the adding state for this specific barber
      setAddingServices((prev) => ({...prev, [barberId]: false}));
    }
  };

  const handleDeleteBarber = useCallback(
    async (barber: Barber) => {
      try {
        await deleteBarber(barber.id);
        const updatedBarbers = await refreshBarbers();
        setBarbers(updatedBarbers);
        await refreshNonBarberProfiles(); // Refresh the non-barber profiles list
        toast({
          title: "Barber deleted",
          description: `${barber.name} has been removed from the barbers list.`,
        });
      } catch (error) {
        console.error("Error deleting barber:", error);
        let errorMessage = "Failed to delete barber. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [refreshBarbers, refreshNonBarberProfiles]
  );

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Barbers</h1>
          <p className="text-muted-foreground">Manage and view all your barbers in one place.</p>
        </div>
        <div>
          <Dialog open={isAddBarberDialogOpen} onOpenChange={setIsAddBarberDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Barber
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
        <Dialog open={isAddBarberDialogOpen} onOpenChange={setIsAddBarberDialogOpen}>
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
                {isLoadingProfiles ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  filteredProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`flex items-center justify-between p-2 cursor-pointer ${selectedProfile?.id === profile.id ? "bg-secondary" : ""}`}
                      onClick={() => setSelectedProfile(profile)}>
                      <div>
                        <p className="font-medium">{profile.full_name || "No Name"}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                      {selectedProfile?.id === profile.id && <Badge variant="outline">Selected</Badge>}
                    </div>
                  ))
                )}
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
              <Button onClick={handleAddBarber} disabled={!selectedProfile || isAddingBarber}>
                <span className="flex items-center justify-center">
                  {isAddingBarber ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    "Assign Barber Role"
                  )}
                </span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarbers.map((barber) => (
          <Card key={barber.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    {barberAvatars[barber.id] ? (
                      <AvatarImage src={barberAvatars[barber.id] || undefined} alt={barber.name || ""} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle>{barber.name}</CardTitle>
                    <CardDescription>{barber.email}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDeleteBarber(barber)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Remove Barber
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <Label className="text-sm font-semibold">Services</Label>
              <ScrollArea className="h-[100px] w-full rounded-md border p-2 mt-2">
                <div className="flex flex-wrap gap-2">
                  {barber.services.map((service) => (
                    <Badge key={service.id} variant="secondary" className="flex items-center gap-1">
                      {service.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isRemovingService[barber.id]}
                        className="h-4 w-4 rounded-full"
                        onClick={() => handleRemoveService(barber.id, service.id)}>
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
                <Button onClick={() => handleAddService(barber.id)} disabled={!selectedServices[barber.id] || addingServices[barber.id]}>
                  {addingServices[barber.id] ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white self-center"></div>
                      <span className="ml-2">Adding...</span>
                    </div>
                  ) : (
                    "Add Service"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredBarbers.length === 0 && (
        <Card>
          <EmptyState
            icon={Scissors}
            title="No barbers found"
            description={
              searchTerm ? `No barbers match your search "${searchTerm}"` : "Get started by adding your first barber. Your barbers will appear here."
            }
          />
        </Card>
      )}
    </div>
  );
}
