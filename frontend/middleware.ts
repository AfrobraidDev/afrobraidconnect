// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "de", "fr"],

  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(de|en|fr)/:path*"],
};
