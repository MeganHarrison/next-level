"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

// Helper to convert path segment to title case
function toTitleCase(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

// Dynamic Breadcrumbs component
export default function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build up the path for each segment
  let path = "";
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, idx) => {
          path += "/" + segment;
          const isLast = idx === segments.length - 1;
          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {toTitleCase(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path}>
                    {toTitleCase(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
