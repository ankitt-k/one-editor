import { NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { getServerSession } from "next-auth/next";
import UserModel from "@/models/UserModel";
import { authOptions } from "@/lib/authOptions";

export async function GET(){
    try{
        const session:any = await  getServerSession(authOptions)

        console.log("session",session)
        if(!session){
            return NextResponse.json(
                { error : "Unauthorized"},
                { status  : 401 }
            )
        }

        await connectDB()

        const user = await UserModel.findById(session?.user?.id)

    
        return NextResponse.json(
            { 
                message : "user details",
                data : user
            },
            { status : 200 }
        )

    }catch(error){
        return NextResponse.json(
            { error : "Something went wrong"},
            { status : 500 }
        )
    }
}