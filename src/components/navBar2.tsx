import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Search, Bolt } from 'lucide-react';
import Link from "next/link";
import { ButtonSignOut } from "@/app/dashboard/_components/button-signout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoTitle from "./logo";
import { Input } from "./ui/input";

export default async function NavBar(){

    const session = await auth.api.getSession({
        headers: await headers() //
    })

    const userAvatarCallback = "https://cdn-icons-png.flaticon.com/512/12225/12225881.png";

    return(
        <div className="flex items-center justify-center w-full h-18 fixed z-30 backdrop-blur-xl bg-gray-950/90">
            <div className="">
                <Input className="rounded-full" />
            </div>
        </div>
    )
}