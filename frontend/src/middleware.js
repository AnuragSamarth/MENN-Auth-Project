import { NextResponse } from "next/server";

const authPath = ['/account/login','/account/register'];

export async function middleware(request){
  try {
    const isAuthenticated = request.cookies.get('is_auth')?.value
    const path = request.nextUrl.pathname;
    
    if(isAuthenticated){
        if(authPath.includes(path)){
           return NextResponse.redirect(new URL('/user/profile', request.url))
        }
    }

     if(!isAuthenticated && !authPath.includes(path)){
        return NextResponse.redirect(new URL('/account/login',request.url))
     }
    return NextResponse.next()
  } catch (error) {
    console.log(error)
  }
}

export const config = {
    // matcher: ['/user/:path*',]
    matcher: ['/user/:path*', '/account/login','/account/register']
}