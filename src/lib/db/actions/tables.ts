"use server";

import { IActionResult } from "@/types/ITypes";
import db from "..";
import { tables } from "../schema";
import type { Table, NewTable } from "../schema";
import { eq, desc } from "drizzle-orm";
import { success, failure } from "@/utils/actionResult";

/**
 * Get all tables for a tenant
 * @param tenantId - Tenant ID
 */
export const getTables = async (
	tenantId: string
): Promise<IActionResult<Table[]>> => {
	try {
		const result = await db
			.select()
			.from(tables)
			.where(eq(tables.tenantId, tenantId))
			.orderBy(desc(tables.createdAt));

		return success("Tables fetched successfully", result);
	} catch (error) {
		return failure("Error fetching tables", error as Error);
	}
};

/**
 * Create a new table
 * @param tenantId - Tenant ID
 * @param data - Table data
 */
export const createTable = async (
	tenantId: string,
	data: Partial<NewTable> & { name: string }
): Promise<IActionResult<Table>> => {
	try {
		const [newTable] = await db
			.insert(tables)
			.values({
				...data,
				tenantId,
			} as NewTable)
			.returning();

		return success("Table created successfully", newTable);
	} catch (error) {
		return failure("Error creating table", error as Error);
	}
};

/**
 * Update a table
 * @param tableId - Table ID
 * @param data - Data to update
 */
export const updateTable = async (
	tableId: string,
	data: Partial<NewTable>
): Promise<IActionResult<Table>> => {
	try {
		const [updatedTable] = await db
			.update(tables)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(tables.id, tableId))
			.returning();

		return success("Table updated successfully", updatedTable);
	} catch (error) {
		return failure("Error updating table", error as Error);
	}
};

/**
 * Delete a table
 * @param tableId - Table ID
 */
export const deleteTable = async (
	tableId: string
): Promise<IActionResult<void>> => {
	try {
		await db.delete(tables).where(eq(tables.id, tableId));
		return success("Table deleted successfully");
	} catch (error) {
		return failure("Error deleting table", error as Error);
	}
};
