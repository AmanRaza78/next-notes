import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import {unstable_noStore as noStore} from "next/cache"
import { NextResponse } from "next/server";
export async function GET(){
    noStore()
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user || user===null || !user.id){
        throw new Error("Something went wrong")
    }

    const dbuser = await prisma.user.findUnique({
        where:{
            id: user.id
        }
    })

    if(!dbuser) {
        await prisma.user.create({
            data:{
                id:user.id,
                firstName:user.given_name??"",
                lastName:user.family_name??"",
                email:user.email??""
            }
        })
    }

    return NextResponse.redirect(process.env.NODE_ENV==="development" ? "http://localhost:3000/": "https://nextnotes-pink.vercel.app/dashboard")


}