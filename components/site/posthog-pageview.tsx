"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { capturePageview } from "@/lib/analytics/client"

export function PostHogPageview() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) capturePageview(pathname)
  }, [pathname])

  return null
}
