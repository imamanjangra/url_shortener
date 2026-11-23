import { clickModel } from "@/src/models/click.model";
import { isbot } from "isbot";
import { UAParser } from "ua-parser-js";

// function getClientIP(req: Request): string | null {
//   const forwardedFor = req.headers.get("x-forwarded-for");

//   if (forwardedFor) {
//     return forwardedFor.split(",")[0].trim();
//   }

//   return req.headers.get("x-real-ip");
// }

async function getLocation(ip: string) {
  try {
    // Skip localhost IPs
    if (ip === "::1" || ip === "127.0.0.1") {
      return null;
    }

    const response = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.error) {
      return null;
    }
    console.log("Api res of ip  =" , data);

    return {
      country: data.country_name || "Unknown",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    };
  } catch (error) {
    console.error("Location fetching failed:", error);
    return null;
  }
}

export const trackClick = async (
  urlDoc: any,
  req: Request
) => {
  try {
    const userAgent = req.headers.get("user-agent");

    if (!userAgent || isbot(userAgent)) {
      return;
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const device = result.device.type || "desktop";
    const cpu = result.cpu.architecture || "Unknown";


    const ip = "getClientIP(req);"
    console.log("Id address = " , ip);
    
    const location = ip ? await getLocation(ip) : null;
    console.log("Location address = " , location);

    await clickModel.create({
      urlId: urlDoc._id,
      browser,
      os,
      device,
      cpu,

      country: location?.country || "Unknown",
      region: location?.region || "Unknown",
      city: location?.city || "Unknown",
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
    });
  } catch (error) {
    console.error("Tracking service failed:", error);
  }
};