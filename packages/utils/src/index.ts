import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
// Note: Twilio helper is NOT re-exported here because it uses Node.js-only
// modules (fs, etc.) that break client-side bundling. Import it directly:
//   import { sendQuestionnaire } from '@repo/utils/src/twilio';

