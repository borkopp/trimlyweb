"use client";
import {useCallback, useEffect, useState} from "react";
import {Trash2, Plus, Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ScrollArea} from "@/components/ui/scroll-area";
import Image from "next/image";
import {Database} from "@/database.types";
import {createClient} from "@/utils/supabase/client";
import {toast} from "@/components/ui/use-toast";
import {addService, deleteService, updateService} from "@/app/actions/dashboard-actions";
import {useRouter} from "next/navigation";

type Service = Database["public"]["Tables"]["services"]["Row"];

async function getImageUrl(path: string) {
  const supabase = createClient();
  const {data} = await supabase.storage.from("barber-images").getPublicUrl(path);

  return data?.publicUrl || null;
}

export default function ServicesPageClient({
  initialServices,
  refreshServices,
}: {
  initialServices: Service[];
  refreshServices: () => Promise<Service[]>;
}) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Service>({
    name: "",
    description: "",
    time: 0,
    price: 0,
    image: "",
    id: 0,
  });
  const [open, setOpen] = useState(false);

  const fetchImageUrls = useCallback(async () => {
    const imageUrls: Record<string, string> = {};
    for (const service of services) {
      if (service.image) {
        const imageUrl = await getImageUrl(service.image);
        if (imageUrl) {
          imageUrls[service.id] = imageUrl;
        }
      }
    }
    setServiceImages(imageUrls);
  }, [services]);

  useEffect(() => {
    fetchImageUrls();
  }, [fetchImageUrls]);

  //handle image upload to supabase storage bucket "barber-images"
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing && editingService) {
          setEditingService({...editingService, image: reader.result as string});
        } else {
          setNewService({...newService, image: reader.result as string});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  //handle adding a new service
  const handleAddService = async () => {
    try {
      await addService(newService);
      setNewService({
        name: "",
        description: "",
        time: 0,
        price: 0,
        image: "",
        id: 0,
      });
      toast({
        title: "Service added",
        description: `${newService.name} has been added to your services.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
        variant: "destructive",
      });
    }
  };

  //handle editing a service
  const handleEditService = async () => {
    try {
      if (editingService) {
        await updateService(editingService);
        const updatedServices = await refreshServices();
        setServices(updatedServices);
        toast({
          title: "Service updated",
          description: `${editingService.name} has been updated.`,
        });
        setEditingService(null);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      });
    }
  };

  //handle removing a service
  const handleRemoveService = async (id: number) => {
    try {
      await deleteService(id);
      setServices(services.filter((service) => service.id !== id));
      toast({
        title: "Service removed",
        description: `${services.find((service) => service.id === id)?.name} has been removed.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove service. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Services Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>Manage your barbershop&apos;s services</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Duration (min)</TableHead>
                  <TableHead>Price (€)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Image
                        src={serviceImages[service.id]}
                        alt={service.name}
                        width={100}
                        height={100}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.time}</TableCell>
                    <TableCell>€ {service.price}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setEditingService(service);
                                setOpen(true);
                              }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Service</DialogTitle>
                              <DialogDescription>Make changes to the service here.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingService?.name}
                                  onChange={(e) => setEditingService((prev) => (prev ? {...prev, name: e.target.value} : null))}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-description" className="text-right">
                                  Description
                                </Label>
                                <Textarea
                                  id="edit-description"
                                  value={editingService?.description || ""}
                                  onChange={(e) => setEditingService((prev) => (prev ? {...prev, description: e.target.value} : null))}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-duration" className="text-right">
                                  Duration (min)
                                </Label>
                                <Input
                                  id="edit-duration"
                                  type="number"
                                  value={editingService?.time}
                                  onChange={(e) => setEditingService((prev) => (prev ? {...prev, time: parseInt(e.target.value)} : null))}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-price" className="text-right">
                                  Price ($)
                                </Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={editingService?.price}
                                  onChange={(e) => setEditingService((prev) => (prev ? {...prev, price: parseFloat(e.target.value)} : null))}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-image" className="text-right">
                                  Image
                                </Label>
                                <Input id="edit-image" type="file" onChange={(e) => handleImageUpload(e, true)} className="col-span-3" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleEditService}>Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Add a new service to your barbershop.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newService.description || ""}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration (min)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newService.time}
                    onChange={(e) => setNewService({...newService, time: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input id="image" type="file" onChange={(e) => handleImageUpload(e, false)} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddService}>Add Service</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
