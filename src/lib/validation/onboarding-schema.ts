import { z } from "zod";
import { TranslationFunction } from "@/types/ITypes";


export const createOnboardingSchema = (t: TranslationFunction) => z.object({
  businessName: z
    .string()
    .min(2, t("validation.businessName.min", { min: 2 }))
    .max(100, t("validation.businessName.max", { max: 100 })),
  phoneNumber: z
    .string()
    .min(10, t("validation.phoneNumber.min", { min: 10 }))
    .max(20, t("validation.phoneNumber.max", { max: 20 }))
    .regex(/^[\+]?[1-9][\d]{0,15}$/, t("validation.phoneNumber.pattern")),
  address: z
    .string()
    .min(10, t("validation.address.min", { min: 10 }))
    .max(200, t("validation.address.max", { max: 200 })),
  tenantSlug: z
    .string()
    .min(3, t("validation.tenantSlug.min", { min: 3 }))
    .max(30, t("validation.tenantSlug.max", { max: 30 }))
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      t("validation.tenantSlug.pattern")
    ),
});

export type OnboardingFormData = z.infer<ReturnType<typeof createOnboardingSchema>>;

// For backwards compatibility
export const onboardingSchema = createOnboardingSchema((key) => key);
