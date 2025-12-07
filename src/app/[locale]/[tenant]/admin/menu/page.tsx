"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const menuItems = [
  {
    id: 1,
    name: "Grilled Salmon",
    category: "mains",
    price: "$32",
    description: "Fresh Atlantic salmon with seasonal vegetables",
    dietary: ["gluten-free"],
    available: true,
  },
  {
    id: 2,
    name: "Caesar Salad",
    category: "appetizers",
    price: "$14",
    description: "Crisp romaine lettuce, parmesan, croutons",
    dietary: ["vegetarian"],
    available: true,
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    category: "desserts",
    price: "$12",
    description: "Warm chocolate cake with vanilla ice cream",
    dietary: ["vegetarian"],
    available: false,
  },
]

export default function AdminMenuPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, and organize your menu items</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>Fill in the details for your new menu item</DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input id="itemName" placeholder="e.g., Grilled Salmon" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizers">Appetizers</SelectItem>
                      <SelectItem value="mains">Main Courses</SelectItem>
                      <SelectItem value="desserts">Desserts</SelectItem>
                      <SelectItem value="drinks">Drinks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" placeholder="Describe your dish..." rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Tags</Label>
                  <Select>
                    <SelectTrigger id="dietary">
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="gluten-free">Gluten Free</SelectItem>
                      <SelectItem value="dairy-free">Dairy Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Add Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Manage all your menu items in one place</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
              <TabsTrigger value="mains">Mains</TabsTrigger>
              <TabsTrigger value="desserts">Desserts</TabsTrigger>
              <TabsTrigger value="drinks">Drinks</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        {!item.available && <Badge variant="secondary">Unavailable</Badge>}
                        {item.dietary.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="mb-1 text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-primary">{item.price}</span>
                        <span className="text-muted-foreground">Category: {item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
