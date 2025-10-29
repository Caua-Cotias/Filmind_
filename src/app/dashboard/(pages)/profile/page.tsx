import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ImageUp, Pencil, UserCheck } from 'lucide-react';
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default async function Profile(){
    const session = await auth.api.getSession({
        headers: await headers() //
    })



    const userAvatarCallback = "https://cdn-icons-png.flaticon.com/512/12225/12225881.png";

    return(
        <div className="w-screen h-screen bg-black relative">
            <div className="w-full h-3/6 absolute inset-0 ">
                <Image className="w-full h-full object-cover" width={500} height={500} src={`${session?.user.image || userAvatarCallback}`} alt="Fundo" />
            </div>

            {/* Camada de blur */}
            <div className="w-full h-full bg-black/80 backdrop-blur-3xl"/>

            {/* Camada principal */}
            <div className="w-full h-3/6 p-12 absolute inset-0 z-10 items-center justify-center">
                <Link href="/dashboard">
                    <div className="flex max-w-24 items-center justify-center rounded-full cursor-pointer text-neutral-100/65 bg-white/10 border backdrop-blur-lg hover:bg-neutral-100 hover:text-neutral-700">
                        <ArrowLeft className="scale-75" />
                        <span>Voltar</span>
                    </div>
                </Link>

                <div className="flex items-center gap-7 m-10">
                    <Button variant="link" className="flex mt-20 cursor-pointer hover:opacity-45">
                        <Avatar className="flex w-60 h-60">
                            <AvatarImage src={`${session?.user.image || userAvatarCallback}`} alt="User_image" />
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    </Button>

                    <div>
                        <div className="flex">
                            <div className="flex text-7xl">{session?.user.name}</div>
                            <div className="flex items-center justify-center rounded-full w-7 h-7 cursor-pointer text-neutral-100/65 bg-white/10 border backdrop-blur-lg hover:bg-neutral-100 hover:text-neutral-700">
                                <Dialog>
                                    <form>
                                        <DialogTrigger asChild>
                                            <Pencil className="scale-75" />
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] bg-transparent">
                                            <DialogHeader>
                                                <DialogTitle>Edite seu perfil</DialogTitle>
                                                <DialogDescription>
                                                    Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="name-1">Usuario</Label>
                                                    <Input id="name-1" name="name" defaultValue={session?.user.name} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                <Button variant="outline">Cancelar</Button>
                                                </DialogClose>
                                                <Button type="submit">Salvar</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </form>
                                </Dialog>
                            </div>
                        </div>

                
                        <div className="flex gap-1 mt-5 px-4 py-0.5 items-center justify-center cursor-pointer rounded-full text-neutral-200/30 border backdrop-blur-lg hover:bg-neutral-100 hover:text-neutral-500">
                            <UserCheck className="scale-75" />
                            <div className="mb-1 animated-background bg-linear-to-r from-cyan-500 to-fuchsia-500 bg-clip-text">{session?.user.email}</div>
                        </div>
                    </div>
                </div>
                <div className="">

                </div>
            </div>
        </div>
    );
};