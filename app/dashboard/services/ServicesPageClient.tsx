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
import {uploadImage} from "@/lib/uploadImage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage} from "@/components/ui/breadcrumb";
import Link from "next/link";

type Service = Database["public"]["Tables"]["services"]["Row"];

async function getImageUrl(path: string) {
  if (!path) return null;
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
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    time: 0,
    price: 0,
    image: "",
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

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
      try {
        const imagePath = await uploadImage(file);
        if (isEditing && editingService) {
          setEditingService({...editingService, image: imagePath});
        } else {
          setNewService({...newService, image: imagePath});
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  //handle adding a new service
  const handleAddService = async () => {
    try {
      const addedService = await addService(newService);
      setServices([...services, addedService]);
      setNewService({
        name: "",
        description: "",
        time: 0,
        price: 0,
        image: "",
      });
      toast({
        title: "Service added",
        description: `${addedService.name} has been added to your services.`,
      });
      setOpenAddDialog(false); // Close the dialog after adding
    } catch (error) {
      console.error("Error adding service:", error);
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
        setOpenEditDialog(false);
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
  const handleRemoveService = async (service: Service) => {
    setServiceToDelete(service);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete.id);
        setServices(services.filter((service) => service.id !== serviceToDelete.id));
        toast({
          title: "Service removed",
          description: `${serviceToDelete.name} has been removed.`,
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove service. Please try again.",
          variant: "destructive",
        });
      }
    }
    setDeleteConfirmOpen(false);
    setServiceToDelete(null);
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
            <BreadcrumbPage>Services</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>Manage your barbershop&apos;s services</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[90vh] w-full rounded-md border">
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
                        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setEditingService(service);
                                setOpenEditDialog(true);
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
                        <Button variant="destructive" size="icon" onClick={() => handleRemoveService(service)}>
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
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
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

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the service.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
