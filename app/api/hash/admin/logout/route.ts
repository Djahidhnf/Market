import { NextResponse } from "next/server";

// export async function POST(req: Request) { 
//     try {
//         await mongooseConnect();
//         const {name, password} = await req.json();
//         const hashedPassword = scryptSync(password, process.env.SALT!, 32).toString('hex');
//         await Admin.create({name, password: hashedPassword});
//         return NextResponse.json({message: "Admin created successfully"}, {status: 201});
//     } catch (err) {
//         console.error(err);
//         return new Response("Hashing failed", { status: 500 });
//     }
// }


export async function POST(req: Request) {
    const response = NextResponse.json({message: "Logged out"}, {status: 200});

    response.cookies.set('adminToken', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/admin',
    })
    return response;
}