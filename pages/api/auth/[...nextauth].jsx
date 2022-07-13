import axios from "axios";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import myAxios from "../../../core/api/apiController";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";

import { login } from "../../../core/api/Login";

// async function refreshAccessToken(tokenObjecth) {
//   try {
//     const url = "http://3.37.39.47:8080/refresh-token";
//     const response = await fetch(url, {
//       headers: {
//         Authorization: access,
//         ["X-Access-Token"]: access,
//         ["X-Refresh-Token"]: refresh,
//         role: "MENTOR",
//       },
//       method: "POST",
//     });

//     const refreshedTokens = await response.json();
//     console.log("refreshedTokens==", refreshedTokens);

//     if (!response.ok) {
//       throw refreshedTokens;
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.headers["x-access-token"],
//       refreshToken: refreshedTokens.headers["x-refresh-token"],
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

// async function refreshAccessToken(tokenObject) {
//   try {
//     // Get a new set of tokens with a refreshToken
//     const tokenResponse = await axios.post(YOUR_API_URL + "auth/refreshToken", {
//       token: tokenObject.refreshToken,
//     });

//     return {
//       ...tokenObject,
//       accessToken: tokenResponse.data.accessToken,
//       accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
//       refreshToken: tokenResponse.data.refreshToken,
//     };
//   } catch (error) {
//     return {
//       ...tokenObject,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

// export default NextAuth({
//   session: {
//     jwt: true,
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   providers: [
//     CredentialProvider({
//       id: "email-password-credential",
//       name: "credentials",
//       credentials: {
//         username: { label: "Email", type: "email" },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },

//       async authorize(credentials, req) {
//         const res = await login(credentials.username, credentials.password);
//         console.log("res===", res);
//         if (res?.status == 200) {
//           return {
//             id: 1,
//             name: "Hi",
//             email: "hkhk",
//             accessToken: res.headers["x-access-token"],
//             refreshToken: res.headers["x-refresh-token"],
//             role: "MENTOR",
//           };
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   secret: process.env.SECRET,
//   callbacks: {
//     async jwt({ token, user, account }) {
//       console.log("user=", user);
//       console.log("acc=", account);
//       console.log("username ====", user);
//       if (typeof user !== typeof undefined) {
//         console.log("valid user!");
//         // token.access = user.accessToken;
//         // token.refresh = user.refreshToken;
//         // token.role = user.role;
//         token.user = user;
//       } else {
//         console.log("invalid user!");
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("session===", session);
//       if (session !== null) {
//         // session.access = token.access;
//         // session.refresh = token.refresh;
//         // session.role = token.role;
//         session.user = token;
//       } else if (
//         typeof token.user !== typeof undefined &&
//         (typeof session.user === typeof undefined ||
//           (typeof session.user !== typeof undefined &&
//             typeof session.user.userId === typeof undefined))
//       ) {
//         session.user = token.user;
//       } else if (typeof token !== typeof undefined) {
//         session.token = token;
//       }
//       return session;
//     },
//   },
//   pages: { signIn: "/common/auth/login" },
// });

const providers = [
  CredentialProvider({
    name: "Credentials",
    id: "email-password-credential",
    credentials: {
      username: { label: "Email", type: "email" },
      password: {
        label: "Password",
        type: "password",
      },
    },

    authorize: async (credentials) => {
      try {
        // Authenticate user with credentials
        // const user = await axios.post(YOUR_API_URL + "auth/login", {
        //   password: credentials.password,
        //   email: credentials.email,
        // });
        const user = await login(credentials.username, credentials.password);
        console.log(credentials);
        if (user.data.accessToken) {
          return user.data;
        }

        return null;
      } catch (e) {
        throw new Error(e);
      }
    },
  }),

  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),

  NaverProvider({
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  }),
];

const callbacks = {
  jwt: async ({ token, user }) => {
    console.log("user == ", user);
    console.log("token ====", token);
    if (user) {
      // This will only be executed at login. Each next invocation will skip this part.
      token.accessToken = user.accessToken;
      token.accessTokenExpiry = user.accessTokenExpiry;
      token.refreshToken = user.refreshToken;
    }

    // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
    const shouldRefreshTime = Math.round(
      token.accessTokenExpiry - 60 * 60 * 1000 - Date.now()
    );

    // If the token is still valid, just return it.
    if (shouldRefreshTime > 0) {
      return Promise.resolve(token);
    }

    // If the call arrives after 23 hours have passed, we allow to refresh the token.
    // token = refreshAccessToken(token);
    return Promise.resolve(token);
  },
  session: async ({ session, token }) => {
    axios.defaults.headers.common.Authorization = `${token.accessToken}`;
    session.accessToken = token.accessToken;
    session.accessTokenExpiry = token.accessTokenExpiry;
    session.error = token.error;

    return Promise.resolve(session);
  },
};

export const options = {
  providers,
  callbacks,
  pages: { signIn: "/common/auth/login" },
  secret: process.env.SECRET,
};

const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;
