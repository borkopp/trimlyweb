"use client";

import {ChevronRight} from "lucide-react";

export function DashboardHeader({
  breadcrumbs,
}: {
  breadcrumbs: {
    title: string;
    href?: string;
  }[];
}) {
  return (
    <div className="flex h-14 items-center gap-4 bg-background px-4 lg:h-[60px] lg:px-6">
      <nav className="flex gap-1 text-sm font-medium">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.title} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            {breadcrumb.href ? (
              <a href={breadcrumb.href} className="text-muted-foreground hover:text-foreground">
                {breadcrumb.title}
              </a>
            ) : (
              <span>{breadcrumb.title}</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
