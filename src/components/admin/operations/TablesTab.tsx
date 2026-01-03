"use client";

import { useState, useRef } from "react";
import { Table as DBTable } from "@/lib/db/schema";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Plus,
	MoreHorizontal,
	Pencil,
	Trash2,
	QrCode,
	Loader2,
	Users,
} from "lucide-react";
import { createTable, updateTable, deleteTable } from "@/lib/db/actions";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { downloadQRCodeAsPNG, getTableQRUrl } from "@/utils/qr-code";

interface TablesTabProps {
	tenantId: string;
	tenantSlug: string;
	initialTables: DBTable[];
	qrCodeSettings: {
		fgColor: string;
		bgColor: string;
		size: "small" | "medium" | "large" | "xlarge";
		level: "L" | "M" | "Q" | "H";
	};
}

export default function TablesTab({
	tenantId,
	tenantSlug,
	initialTables,
	qrCodeSettings,
}: TablesTabProps) {
	const [tables, setTables] = useState<DBTable[]>(initialTables);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentTable, setCurrentTable] = useState<DBTable | null>(null);
	const qrCodeRef = useRef<SVGSVGElement>(null);

	// Form states
	const [tableName, setTableName] = useState("");
	const [minSeats, setMinSeats] = useState(1);
	const [maxSeats, setMaxSeats] = useState(4);

	const resetForm = () => {
		setTableName("");
		setMinSeats(1);
		setMaxSeats(4);
		setCurrentTable(null);
	};

	const handleAddTable = async () => {
		if (!tableName) return;
		setIsLoading(true);
		try {
			const result = await createTable(tenantId, {
				name: tableName,
				minSeats,
				maxSeats,
			});

			if (result.succeeded && result.data) {
				setTables([result.data, ...tables]);
				toast.success("Table created successfully");
				setIsAddDialogOpen(false);
				resetForm();
			} else {
				toast.error(result.error?.message || "Failed to create table");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateTable = async () => {
		if (!currentTable || !tableName) return;
		setIsLoading(true);
		try {
			const result = await updateTable(currentTable.id, {
				name: tableName,
				minSeats,
				maxSeats,
			});

			if (result.succeeded && result.data) {
				setTables(
					tables.map((t) => (t.id === currentTable.id ? result.data! : t))
				);
				toast.success("Table updated successfully");
				setIsEditDialogOpen(false);
				resetForm();
			} else {
				toast.error(result.error?.message || "Failed to update table");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteTable = async (tableId: string) => {
		if (!confirm("Are you sure you want to delete this table?")) return;
		try {
			const result = await deleteTable(tableId);
			if (result.succeeded) {
				setTables(tables.filter((t) => t.id !== tableId));
				toast.success("Table deleted successfully");
			} else {
				toast.error(result.error?.message || "Failed to delete table");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		}
	};

	const openEditDialog = (table: DBTable) => {
		setCurrentTable(table);
		setTableName(table.name);
		setMinSeats(table.minSeats || 1);
		setMaxSeats(table.maxSeats || 4);
		setIsEditDialogOpen(true);
	};

	const openQRDialog = (table: DBTable) => {
		setCurrentTable(table);
		setIsQRDialogOpen(true);
	};

	const handleDownloadQRCode = () => {
		if (qrCodeRef.current && currentTable) {
			downloadQRCodeAsPNG(qrCodeRef.current, `QR-${currentTable.name}`);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold text-foreground">Tables</h2>
					<p className="text-muted-foreground mt-1">
						Manage your restaurant tables and QR codes
					</p>
				</div>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Add Table
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Tables</CardTitle>
					<CardDescription>
						A list of all tables in your restaurant.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>No.</TableHead>
								<TableHead>Table Name</TableHead>
								<TableHead>Capacity</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tables.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="h-24 text-center">
										No tables found. Add one to get started.
									</TableCell>
								</TableRow>
							) : (
								tables.map((table, index) => (
									<TableRow key={table.id}>
										<TableCell className="font-medium">{index + 1}</TableCell>
										<TableCell>{table.name}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span>
													{table.minSeats} - {table.maxSeats}
												</span>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<span className="sr-only">Open menu</span>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem onClick={() => openQRDialog(table)}>
														<QrCode className="mr-2 h-4 w-4" />
														View QR Code
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => openEditDialog(table)}
													>
														<Pencil className="mr-2 h-4 w-4" />
														Edit Table
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteTable(table.id)}
														className="text-destructive focus:text-destructive"
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete Table
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Add Table Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Table</DialogTitle>
						<DialogDescription>
							Create a new table for your restaurant.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								value={tableName}
								onChange={(e) => setTableName(e.target.value)}
								className="col-span-3"
								placeholder="e.g. Table 1 or Vip Area"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="minSeats" className="text-right">
								Min Seats
							</Label>
							<Input
								id="minSeats"
								type="number"
								min={1}
								value={minSeats}
								onChange={(e) => setMinSeats(parseInt(e.target.value))}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="maxSeats" className="text-right">
								Max Seats
							</Label>
							<Input
								id="maxSeats"
								type="number"
								min={1}
								value={maxSeats}
								onChange={(e) => setMaxSeats(parseInt(e.target.value))}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAddDialogOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button onClick={handleAddTable} disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Add Table
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Table Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Table</DialogTitle>
						<DialogDescription>Update table details.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-name" className="text-right">
								Name
							</Label>
							<Input
								id="edit-name"
								value={tableName}
								onChange={(e) => setTableName(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-minSeats" className="text-right">
								Min Seats
							</Label>
							<Input
								id="edit-minSeats"
								type="number"
								min={1}
								value={minSeats}
								onChange={(e) => setMinSeats(parseInt(e.target.value))}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-maxSeats" className="text-right">
								Max Seats
							</Label>
							<Input
								id="edit-maxSeats"
								type="number"
								min={1}
								value={maxSeats}
								onChange={(e) => setMaxSeats(parseInt(e.target.value))}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditDialogOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdateTable} disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* QR Code Dialog */}
			<Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>QR Code for {currentTable?.name}</DialogTitle>
						<DialogDescription>
							Scan this code to view the menu for this table.
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-center py-6">
						{currentTable && (
							<div className="p-4 bg-white rounded-lg shadow-sm border">
								<QRCodeSVG
									ref={qrCodeRef}
									value={getTableQRUrl(currentTable.id, tenantSlug)}
									size={200}
									bgColor={qrCodeSettings.bgColor}
									fgColor={qrCodeSettings.fgColor}
									level={qrCodeSettings.level}
									includeMargin={true}
								/>
							</div>
						)}
					</div>
					<div className="text-center text-sm text-muted-foreground break-all px-4">
						{currentTable && getTableQRUrl(currentTable.id, tenantSlug)}
					</div>
					<DialogFooter className="sm:justify-center">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setIsQRDialogOpen(false)}
						>
							Close
						</Button>
						<Button type="button" onClick={handleDownloadQRCode}>
							Download PNG
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
