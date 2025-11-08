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
    <Button className="py-5 cursor-pointer text-neutral-100/65 bg-transparent hover:bg-transparent hover:text-neutral-100" onClick={signOut}>
      Sair da conta
    </Button>
  );
}