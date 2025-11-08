import Image from "next/image";
import logo from "../../public/+.gif";


export default function LogoTitle() {
    return (
        <div className="flex items-center justify-center font-bold cursor-default group relative select-none">
            <span className="
                        transition-all duration-500 
                        bg-gradient-to-r from-neutral-200 via-neutral-200 to-neutral-200 
                        bg-clip-text text-transparent 
                        animate-gradient-x
                        group-hover:from-amber-600 group-hover:via-pink-500 group-hover:to-purple-500
                        group-hover:drop-shadow-[0_0_10px_rgba(255,0,200,0.9)]
                    ">
                Filmind
            </span>

            <Image
                className="w-6 transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(255,120,255,0.9)] group-hover:scale-110"
                src={logo}
                alt="logo"
            />

            {/* Glow effect behind */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 bg-gradient-to-r from-amber-600 via-indigo-200 to-blue-700"></div>
        </div>
    )
}