import React from "react";
import {MacbookScroll} from "@/components/ui/macbook-scroll";
import Link from "next/link";

export default function MacbookScrollDemo() {
  return (
    <div className="overflow-hidden bg-background w-full">
      <MacbookScroll title={<span>Manage everything in one place.</span>} src={`/dashboard.png`} showGradient={false} />
    </div>
  );
}
