import { scryptSync } from "node:crypto";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, password } = await req.json();
    // const admin = await Admin.findOne({ name });

    const hashedPassword = scryptSync(password, process.env.SALT!, 32).toString('hex');
    console.log(hashedPassword);
    
    if (process.env.ADMIN_PASSWORD === hashedPassword && process.env.ADMIN_NAME === name) {
        const response = NextResponse.json({message: "Login successful"}, {status: 200});

        
        const token = jwt.sign({ name: process.env.ADMIN_NAME! }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/admin',
        });

        return response;
        
    } else {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

}
    