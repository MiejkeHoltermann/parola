export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home",
    "/import-data",
    "/profile",
    "/verbpractice",
    "/verbs",
    "/wordpractice",
    "/words",
  ],
};
