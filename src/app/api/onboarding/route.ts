import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { createTenant } from "@/lib/db/actions";
import { onboardingSchema } from "@/lib/validation/onboarding-schema";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    if (!session || !("user" in session) || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    // Create the tenant
    const result = await createTenant(
      validatedData.businessName,
      validatedData.phoneNumber,
      validatedData.address,
      validatedData.tenantSlug,
      session.user.id
    );

    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: "Business created successfully",
        tenant: result.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to create business",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Onboarding API error:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid form data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
