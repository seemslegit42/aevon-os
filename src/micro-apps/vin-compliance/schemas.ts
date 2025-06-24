
import { z } from 'zod';

export const vinFormSchema = z.object({
  manufacturerId: z.string().length(3, "WMI must be 3 characters").regex(/^[A-Z0-9]{3}$/, "WMI must be alphanumeric").default('1A9'),
  trailerType: z.enum(['Flatbed', 'Enclosed', 'Gooseneck', 'Utility']),
  modelYear: z.coerce.number().int().min(2020, "Year must be 2020 or later").max(2030, "Year must be 2030 or earlier"),
  plantCode: z.string().length(1, "Plant code must be 1 character").regex(/^[A-Z0-9]$/, "Plant code must be a single letter or number").default('D'),
});

export type VinFormData = z.infer<typeof vinFormSchema>;
