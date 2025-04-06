import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const Logo = () => {
  return (
    <Link href='/'>
      <div className='flex items-center gap-x-4 hover:opacity-75 transition'>
        <div className='bg-purple-400 rounded-full ml-1.5 lg:ml-0 mr-12 lg:mr-0 shrink-0 lg:shrink'>
          <img
            src='/Bethere.svg'
            alt='Streamovision Logo'
            height={46}
            width={46}
          />
        </div>
        <div className={cn("hidden lg:block", font.className)}>
          <p className='text-lg font-semibold'>Streamovision</p>
          <p className='text-xs text-muted-foreground'>Let&apos;s play!</p>
        </div>
      </div>
    </Link>
  );
};
