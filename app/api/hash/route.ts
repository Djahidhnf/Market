import { NextResponse } from 'next/server';
import { url } from 'node:inspector';

const {createHmac} = await import('node:crypto');


export async function POST(req: Request) {
    try {
        const cart = await req.json();
        console.log(cart)

        const hmac = createHmac('sha256', process.env.SECRET_HASH_KEY!);
        hmac.update(JSON.stringify(cart));
        const hashedData = hmac.digest('hex');

        const {searchParams} = new URL(req.url);
        const cartHash = searchParams.get('cartHash');

        if (cartHash) {
            const same = cartHash === hashedData;
            return NextResponse.json({message: "Hash check successfull!", hash: hashedData, same: same})
        }
        
        return NextResponse.json({message: "Hash successfull", hash: hashedData})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: "Hashing failed"}, {status: 500})
    }
}