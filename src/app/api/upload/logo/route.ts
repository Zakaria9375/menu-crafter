import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const tenantId = formData.get("tenantId") as string;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		if (!tenantId) {
			return NextResponse.json(
				{ error: "No tenant ID provided" },
				{ status: 400 }
			);
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return NextResponse.json(
				{ error: "File must be an image" },
				{ status: 400 }
			);
		}

		// Validate file size (2MB)
		if (file.size > 2 * 1024 * 1024) {
			return NextResponse.json(
				{ error: "File size must be less than 2MB" },
				{ status: 400 }
			);
		}

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Create uploads directory if it doesn't exist
		const uploadsDir = join(process.cwd(), "public", "uploads", "logos");
		if (!existsSync(uploadsDir)) {
			mkdirSync(uploadsDir, { recursive: true });
		}

		// Generate unique filename
		const ext = file.name.split(".").pop();
		const filename = `${tenantId}-${Date.now()}.${ext}`;
		const filepath = join(uploadsDir, filename);

		// Save file
		await writeFile(filepath, buffer);

		// Return the public URL
		const url = `/uploads/logos/${filename}`;

		return NextResponse.json({ url, success: true });
	} catch (error) {
		console.error("Error uploading file:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 }
		);
	}
}
