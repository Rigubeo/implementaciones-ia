ALTER TABLE public."LoyaltyCard" ADD COLUMN "holderEmail" TEXT;
UPDATE public."LoyaltyCard" AS card
SET "holderEmail" = lower(trim(holder.email))
FROM public."User" AS holder
WHERE card."userId" = holder.id;
ALTER TABLE public."LoyaltyCard" ALTER COLUMN "holderEmail" SET NOT NULL;
ALTER TABLE public."LoyaltyCard" ALTER COLUMN "userId" DROP NOT NULL;
CREATE UNIQUE INDEX "LoyaltyCard_programId_holderEmail_key" ON public."LoyaltyCard" ("programId", "holderEmail");
CREATE INDEX "LoyaltyCard_holderEmail_idx" ON public."LoyaltyCard" ("holderEmail");

-- Keep the currently deployed app compatible while it is being updated.
CREATE FUNCTION public.loyalty_card_legacy_email() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW."holderEmail" IS NULL AND NEW."userId" IS NOT NULL THEN
    SELECT lower(trim(email)) INTO NEW."holderEmail" FROM public."User" WHERE id = NEW."userId";
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER loyalty_card_legacy_email BEFORE INSERT ON public."LoyaltyCard"
FOR EACH ROW EXECUTE FUNCTION public.loyalty_card_legacy_email();
