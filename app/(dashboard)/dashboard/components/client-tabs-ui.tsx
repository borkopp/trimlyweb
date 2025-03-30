"use client";
import {useRouter, useSearchParams} from "next/navigation";
import {TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {ListFilter, File} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Client component for tabs UI
export default function ClientTabsUI({currentView}: {currentView: string}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);
    router.push(`/dashboard?${params.toString()}`, {scroll: false});
  };

  return (
    <div className="flex items-center">
      <TabsList>
        <TabsTrigger value="today" onClick={() => handleTabChange("today")} data-state={currentView === "today" ? "active" : ""}>
          Today
        </TabsTrigger>
        <TabsTrigger value="week" onClick={() => handleTabChange("week")} data-state={currentView === "week" ? "active" : ""}>
          Week
        </TabsTrigger>
        <TabsTrigger value="all" onClick={() => handleTabChange("all")} data-state={currentView === "all" ? "active" : ""}>
          All
        </TabsTrigger>
      </TabsList>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Haircuts</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Beard Trims</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Shaves</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Export</span>
        </Button>
      </div>
    </div>
  );
}
