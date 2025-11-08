import Link from "next/link"
import { SignupForm } from "./_components/signup-form"
import LogoTitle from "@/components/logo";
import Image from "next/image";

export default function Signup() {
  return (
    <div className="flex min-h-screen relative flex-col items-center justify-center space-y-5">
      <div className="w-full h-full absolute inset-0 -z-10 opacity-20">
        <Image width={1920} height={1080} className="w-full h-full object-cover" src="/fallbackPlayer.png" alt="WallpaperFilmind" />
      </div>

      <div>
        <div className="ml-9 mb-7 scale-200">
          <LogoTitle />
        </div>

        <div className="flex p-12 border-2 flex-col items-center justify-center space-y-3 backdrop-blur-xl">
          <h1 className="text-3xl font-bold">Crie sua conta</h1>
          <p className="text-sm text-muted-foreground cursor-default">Adicione um email válido e uma senha forte</p>

          <div className="w-full max-w-md space-y-8">
            <SignupForm />
          </div>

          <div className="text-center text-sm">
            <p>
              Já tem uma conta?{" "}
              <Link href="/" className="font-medium text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

