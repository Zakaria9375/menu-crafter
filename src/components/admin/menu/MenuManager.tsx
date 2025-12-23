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
import { Plus, Pencil, Trash2, Search, FolderPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Category, MenuItem } from "@/lib/db/schema"
import { createCategory, createMenuItem, deleteCategory, deleteMenuItem } from "@/lib/db/actions/menu"
import { toast } from "sonner"

interface MenuManagerProps {
  tenantId: string
  initialCategories: (Category & { items: MenuItem[] })[]
}

export default function MenuManager({ tenantId, initialCategories }: MenuManagerProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategories[0]?.id || "")

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    dietary: [] as string[],
  })

  const handleCreateCategory = async () => {
    if (!newCategoryName) return
    const res = await createCategory({
      tenantId,
      name: newCategoryName,
      order: categories.length,
    })
    if (res.success && res.data) {
      setCategories([...categories, { ...res.data, items: [] }])
      setNewCategoryName("")
      setIsAddCategoryOpen(false)
      toast.success("Category created")
    } else {
      toast.error("Failed to create category")
    }
  }

  const handleCreateItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.categoryId) return
    const res = await createMenuItem({
      ...newItem,
      categoryId: newItem.categoryId,
    })
    if (res.success && res.data) {
      setCategories(categories.map(cat => 
        cat.id === newItem.categoryId 
          ? { ...cat, items: [...cat.items, res.data!] }
          : cat
      ))
      setNewItem({ name: "", description: "", price: "", categoryId: "", dietary: [] })
      setIsAddItemOpen(false)
      toast.success("Item created")
    } else {
      toast.error("Failed to create item")
    }
  }

  const handleDeleteItem = async (itemId: string, categoryId: string) => {
    const res = await deleteMenuItem(itemId)
    if (res.success) {
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
          : cat
      ))
      toast.success("Item deleted")
    } else {
      toast.error("Failed to delete item")
    }
  }
  
  const handleDeleteCategory = async (categoryId: string) => {
      const res = await deleteCategory(categoryId)
      if (res.success) {
          setCategories(categories.filter(c => c.id !== categoryId))
          if (selectedCategory === categoryId) {
              setSelectedCategory(categories.find(c => c.id !== categoryId)?.id || "")
          }
          toast.success("Category deleted")
      } else {
          toast.error("Failed to delete category")
      }
  }

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0 || searchQuery === "")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, and organize your menu items</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new section for your menu</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input 
                    id="categoryName" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Starters" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateCategory}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
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
              <div className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input 
                      id="itemName" 
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="e.g., Grilled Salmon" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newItem.categoryId} 
                      onValueChange={(val) => setNewItem({...newItem, categoryId: val})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newItem.description || ""}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Describe your dish..." 
                    rows={3} 
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input 
                      id="price" 
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="$0.00" 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
          <Tabs defaultValue="all" value={selectedCategory || "all"} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All Items</TabsTrigger>
              {categories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id}>{cat.name}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-8">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{cat.name}</h3>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Category
                        </Button>
                    </div>
                    {cat.items.length === 0 && <p className="text-sm text-muted-foreground">No items in this category.</p>}
                    {cat.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            {!item.available && <Badge variant="secondary">Unavailable</Badge>}
                          </div>
                          <p className="mb-1 text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-primary">{item.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id, cat.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </TabsContent>

            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-6">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{cat.name}</h3>
                         <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Category
                        </Button>
                    </div>
                    {cat.items.length === 0 && <p className="text-sm text-muted-foreground">No items in this category.</p>}
                    {cat.items.filter(item => 
                      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            {!item.available && <Badge variant="secondary">Unavailable</Badge>}
                          </div>
                          <p className="mb-1 text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-primary">{item.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id, cat.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
