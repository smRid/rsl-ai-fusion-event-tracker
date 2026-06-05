import { z } from "zod";
import { normalizeTracker } from "./tracker-utils";

export const extractedFusionSchema = z.object({
  fusionName: z.string().nullable().optional(),
  dateRange: z
    .object({
      start: z.string().nullable().optional(),
      end: z.string().nullable().optional()
    })
    .optional(),
  events: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["Tournament", "Event"]),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
      fragments: z.number().nullable().optional(),
      needsReview: z.boolean().optional()
    })
  ),
  totalFragments: z.number().nullable().optional()
});

export function normalizeExtractedFusion(raw: unknown) {
  const parsed = extractedFusionSchema.parse(raw);
  return normalizeTracker({
    ...parsed,
    requiredFragments: 100,
    source: "ai"
  });
}
