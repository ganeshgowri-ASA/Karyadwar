import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    empNo: string
    domainId: string
    role: string
    defaultSiteId: string
    defaultSiteName: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      empNo: string
      domainId: string
      role: string
      defaultSiteId: string
      defaultSiteName: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    empNo: string
    domainId: string
    role: string
    defaultSiteId: string
    defaultSiteName: string
  }
}
