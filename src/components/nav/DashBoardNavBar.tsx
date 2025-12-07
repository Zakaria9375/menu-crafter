"use client";
import { Button } from "../ui/button";
import { useState } from "react";
import { Store, Globe, Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function DashBoardNavBar() {
	const [viewMode, setViewMode] = useState<'app' | 'site'>('app');

	return (
		<nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'app' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('app')}
                >
                  <Store className="mr-2 h-4 w-4" />
                  APP
                </Button>
                <Button
                  variant={viewMode === 'site' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('site')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  SITE
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
	);
}