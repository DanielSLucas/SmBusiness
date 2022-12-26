import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: { 
    async redirect (url) {      
      if(url.url === "/signin") return '/home'
      return '/'
    },
    async jwt ({ token, account }) {            
      return {
        ...token,
        ...(account ? { accessToken: account.id_token } : {})
      };
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      
      return session;
    }
  }
})