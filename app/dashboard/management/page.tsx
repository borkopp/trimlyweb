"use client";

import {useState, useRef, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "@/components/ui/use-toast";
import {assignBarberRole, searchUsers, getServices} from "@/app/actions/barber-actions";
import {Database} from "@/database.types";
import {Clock3Icon, DollarSignIcon, PlusIcon, TrashIcon} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import Image from "next/image";

type User = Database["public"]["Tables"]["profiles"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

export default function ManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input changes
  const handleSearch = async (query: string) => {
    if (query.trim().length > 1) {
      try {
        const results = await searchUsers(query);
        setSearchResults((results as User[]) || []);
        setIsDropdownOpen(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to search users. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  // Handle user selection from search results
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.full_name || "");
    setIsDropdownOpen(false);
    console.log(selectedUser);
  };

  // Handle service checkbox toggle
  const handleServiceToggle = (service: Service, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, service]);
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    }
  };

  // Handle assigning barber role
  const handleAssignBarber = async () => {
    if (selectedUser && selectedServices.length > 0) {
      try {
        await assignBarberRole(
          selectedUser.id,
          selectedServices.map((service) => service.id)
        );
        toast({
          title: "Barber role assigned",
          description: `${selectedUser.full_name} has been assigned as a barber.`,
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to assign barber role. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assign Barber Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 ">
            {/* User Search and Services Selection */}
            <div className="flex flex-col lg:flex-row lg:space-x-6 mb-10">
              {/* User Search */}
              <div className="flex-1 relative">
                <Label htmlFor="userSearch">Search User</Label>
                <Input
                  id="userSearch"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Search by name or email"
                  className="mt-2 ring-none focus:ring-none focus:outline-none outline-none"
                />
                {isDropdownOpen &&
                  searchResults &&
                  searchResults.map((user) => (
                    <div key={user.id} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleUserSelect(user)}>
                      {user.full_name} ({user.email})
                    </div>
                  ))}
              </div>

              {/* Services Selection */}
              <div className="flex-1 mt-4 lg:mt-0">
                <Label>Select Services</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {services &&
                    services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox id={`service-${service.id}`} checked={selectedServices.some((s) => s.id === service.id)} onCheckedChange={(checked: boolean) => handleServiceToggle(service, checked)} />
                        <Label htmlFor={`service-${service.id}`}>{service.name}</Label>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Assign Button */}
            <div className="mt-4">
              <Button onClick={handleAssignBarber} disabled={!selectedUser || selectedServices.length === 0} className="w-full sm:w-auto">
                Assign Barber Role
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="serviceName">Service Name</Label>
              <Input id="serviceName" placeholder="e.g., Haircut" />
            </div>
            <div>
              <Label htmlFor="serviceImage">Image URL</Label>
              <Input id="serviceImage" placeholder="https://example.com/image.jpg" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="serviceDescription">Description</Label>
              <Textarea id="serviceDescription" placeholder="Describe the service..." />
            </div>
            <div>
              <Label htmlFor="serviceDuration">Duration (minutes)</Label>
              <Input id="serviceDuration" type="number" placeholder="30" />
            </div>
            <div>
              <Label htmlFor="servicePrice">Price (€)</Label>
              <Input id="servicePrice" type="number" placeholder="25" />
            </div>
          </div>
          <Button className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image src={service.image} alt={service.name} width={64} height={64} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock3Icon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{service.time} min</span>
                        <DollarSignIcon className="h-4 w-4 text-gray-400 ml-2" />
                        <span className="text-sm">${service.price}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" className="mt-2">
                    <TrashIcon className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
