import { z } from "zod";

/** 32 random bytes encoded as base64url. */
export const activationTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{43}$/);

const firstValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

export const activarSearchParamsSchema = z.object({
  token: z.preprocess(
    firstValue,
    activationTokenSchema.optional().catch(undefined),
  ),
});

export const activarFormSchema = z.object({
  token: activationTokenSchema,
});
