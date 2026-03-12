import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    empNo: string | null;
    domainId: string | null;
    defaultSite: number | null;
    siteName: string | null;
    siteCode: string | null;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      empNo: string | null;
      domainId: string | null;
      defaultSite: number | null;
      siteName: string | null;
      siteCode: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    empNo: string | null;
    domainId: string | null;
    defaultSite: number | null;
    siteName: string | null;
    siteCode: string | null;
  }
}
