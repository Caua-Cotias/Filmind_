"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function ButtonSignOut() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/")
        }
      }
    })
  }

  return (
    <Button className="py-5 rounded-full cursor-pointer text-neutral-100/65 bg-white/10 border backdrop-blur-lg hover:bg-neutral-100 hover:text-neutral-700" onClick={signOut}>
      Sair da conta
    </Button>
  );
}