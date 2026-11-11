ALTER TABLE "LoyaltyProgram"
  ADD COLUMN "promotion" TEXT,
  ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'profesional';

ALTER TABLE "LoyaltyProgram" ADD CONSTRAINT "LoyaltyProgram_theme_valid"
  CHECK ("theme" IN ('profesional', 'moderno', 'fresco', 'calido', 'minimalista'));
