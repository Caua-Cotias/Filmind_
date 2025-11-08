import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Search, Bolt } from 'lucide-react';
import Link from "next/link";
import { ButtonSignOut } from "@/app/dashboard/_components/button-signout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoTitle from "./logo";

export default async function NavBar(){

    const session = await auth.api.getSession({
        headers: await headers() //
    })

    const userAvatarCallback = "https://cdn-icons-png.flaticon.com/512/12225/12225881.png";

    return(
        <div className="flex items-center justify-between w-full h-14 fixed z-30 backdrop-blur-xl bg-gray-950/90">
            <div className="flex px-24 gap-6">
                <Link href="/dashboard/profile" className="flex px-2 pr-5 py-1 items-center gap-3">
                    <Avatar className="flex w-7 h-7">
                        <AvatarImage src={`${session?.user.image || userAvatarCallback}`} alt="User_image" />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>

                    <span>{session?.user.name}</span>
                </Link>

                <div className="flex gap-2 p-1">
                    <Link href="/dashboard/add-media">
                        <Button className="rounded-full cursor-pointer text-neutral-100/70 font-bold bg-transparent hover:bg-neutral-100 hover:text-neutral-700">
                            Para voce
                        </Button>
                    </Link>
                    <Button className="rounded-full cursor-pointer text-neutral-100/70 font-bold bg-transparent hover:bg-neutral-100 hover:text-neutral-700">
                        Filmes
                    </Button>
                    <Button className="rounded-full cursor-pointer text-neutral-100/70 font-bold bg-transparent hover:bg-neutral-100 hover:text-neutral-700">
                        Series
                    </Button>
                    <Button className="rounded-full cursor-pointer text-neutral-100/70 font-bold bg-transparent hover:bg-neutral-100 hover:text-neutral-700">
                        Animes
                    </Button>
                    <Button className="rounded-full cursor-pointer text-neutral-100/70 font-bold bg-transparent hover:bg-neutral-100 hover:text-neutral-700">
                        Tv
                    </Button>
                    

                </div>


            </div>

            <div className="flex items-center justify-center pr-24 gap-4">
                
                <Link href="/dashboard/browse">
                    <Button className="py-5 cursor-pointer text-neutral-100/65 bg-transparent hover:bg-transparent hover:text-neutral-100">
                        <Search className="scale-110" />
                    </Button>
                </Link>
                <Button className="py-5 cursor-pointer text-neutral-100/65 bg-transparent hover:bg-transparent hover:text-neutral-100">
                    <Bolt className="scale-110" />
                </Button>
                <ButtonSignOut />
                
                <LogoTitle />
            </div>
        </div>
    )
}