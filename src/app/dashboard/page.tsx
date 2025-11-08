import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Home from "../pages/home/home";
import NavBar from "@/components/navBar";

export default async function Dashboard() {

  const session = await auth.api.getSession({
    headers: await headers() //
  })

  if(!session){
    redirect("/")
  }

  return (
    <div>
      <NavBar />
      <Home />
    </div>
  );
}