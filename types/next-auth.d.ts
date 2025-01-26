import {DefaultSession, DefaultUser} from "next-auth"

declare module "next-auth" {
    interface Session {
        access_token?: string
        user: {
            id: string
            login?: string
            name?: string
            email?: string
            image?: string
        } & Omit<DefaultSession["user"], "id">
    }

    interface User extends Omit<DefaultUser, "id"> {
        id: string
        login?: string
        name?: string
        email?: string
        image?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token?: string
        id: string
        login?: string
        name?: string
        email?: string
        image?: string
    }
}
