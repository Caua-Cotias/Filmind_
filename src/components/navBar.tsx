import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Search, Bolt } from 'lucide-react';
import Link from "next/link";
import { ButtonSignOut } from "@/app/dashboard/_components/button-signout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function NavBar(){

    const session = await auth.api.getSession({
        headers: await headers() //
    })

    return(
        <div className="flex items-end justify-between w-full h-20 fixed z-30">
            <div className="flex px-24 gap-6 items-center justify-center">
                <Link href="/dashboard/profile" className="flex px-2 py-1 rounded-full bg-white/10 border backdrop-blur-lg items-center gap-3">
                    <Avatar className="flex w-9 h-9">
                        <AvatarImage src={""} alt="@shadcn" />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>

                    <span>{session?.user.name}</span>
                </Link>

                <div className="flex gap-2">
                    <Link href="/">
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
                    <Button className="rounded-full cursor-pointer text-neutral-100/70 font-bold bg-transparent hover:bg-neutral-100 hover:text-neutral-700">
                        Blibioteca
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-center pr-24 gap-4">
                <Button className="rounded-full py-5 cursor-pointer text-neutral-100/65 bg-white/10 border backdrop-blur-lg hover:bg-neutral-100 hover:text-neutral-700">
                    <Search className="scale-110" />
                </Button>
                <Button className="rounded-full py-5 cursor-pointer text-neutral-100/65 bg-white/10 border backdrop-blur-lg hover:bg-neutral-100 hover:text-neutral-700">
                    <Bolt className="scale-110" />
                </Button>
                <ButtonSignOut />
                <div className="font-bold text-neutral-100/65 cursor-default">
                    Filmind +
                </div>
            </div>
        </div>
    )
}