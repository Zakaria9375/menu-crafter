'use server';

import db from '@/lib/db';
import { categories, menuItems, NewCategory, NewMenuItem } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// --- Categories ---

export async function getMenu(tenantId: string) {
  console.log('tenantId', tenantId);
  const menuCategories = await db.query.categories.findMany({
    where: eq(categories.tenantId, tenantId),
    orderBy: [asc(categories.order)],
    with: {
      items: {
        orderBy: [asc(menuItems.order)],
      },
    },
  });
  console.log('menuCategories', menuCategories);
  return menuCategories;
}

export async function createCategory(data: NewCategory) {
  try {
    const [newCategory] = await db.insert(categories).values(data).returning();
    revalidatePath(`/${data.tenantId}/admin/menu`);
    return { success: true, data: newCategory };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: Partial<NewCategory>) {
  try {
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    // We might not have tenantId here easily if it's not passed, 
    // but usually we can revalidate the path if we know the structure or pass tenantId.
    // For now, let's assume the caller handles revalidation or we fetch tenantId.
    // A better approach is to pass tenantId to this function for revalidation path construction.
    return { success: true, data: updatedCategory };
  } catch (error) {
    console.error('Failed to update category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}

// --- Menu Items ---

export async function createMenuItem(data: NewMenuItem) {
  try {
    const [newItem] = await db.insert(menuItems).values(data).returning();
    return { success: true, data: newItem };
  } catch (error) {
    console.error('Failed to create menu item:', error);
    return { success: false, error: 'Failed to create menu item' };
  }
}

export async function updateMenuItem(id: string, data: Partial<NewMenuItem>) {
  try {
    const [updatedItem] = await db
      .update(menuItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('Failed to update menu item:', error);
    return { success: false, error: 'Failed to update menu item' };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete menu item:', error);
    return { success: false, error: 'Failed to delete menu item' };
  }
}
