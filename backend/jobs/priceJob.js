import cron from "node-cron";
import { updateLivePrices } from "../services/priceService.js";

export const initJobs = () => {
    // Schedule price updates (11 AM - 3 PM, every 10 seconds)
    // Nepal Time: UTC+5:45 -> 5:15 AM - 9:15 AM UTC
    cron.schedule("*/10 * 5-9 * * 0-4", () => {
        const nepalHour = new Date().getUTCHours() + 5;
        const nepalMinute = new Date().getUTCMinutes() + 45;
        const adjustedHour = nepalMinute >= 60 ? nepalHour + 1 : nepalHour;
        const finalHour = adjustedHour >= 24 ? adjustedHour - 24 : adjustedHour;

        if (finalHour >= 11 && finalHour < 15) {
            console.log("Updating live prices...");
            updateLivePrices();
        }
    });

    console.log("Background jobs initialized.");
};
