import React from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/app/(root)/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const MobileNav = () => {
  const pathName = usePathname();

  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        {/* Hamburger Menu Button */}
        <SheetTrigger aria-label="Open navigation menu">
          <Image 
            src={"/icons/hamburger.svg"} 
            alt='Open menu' 
            className='cursor-pointer sm:hidden' 
            width={32} 
            height={32} 
          />
        </SheetTrigger>

        {/* Sidebar Content */}
        <SheetContent side={"left"} className="bg-dark-1">
          <Link href="/" className='flex items-center gap-3'>
            <Image src={"/icons/logo.svg"} width={32} height={32} alt='Logo' />
            <p className='text-white font-bold text-2xl'>Zoom</p>
          </Link>

          {/* Sidebar Links */}
          <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
            <section className='flex h-full flex-col gap-6 pt-16 text-white'>
              {sidebarLinks.map((link) => {
                const isActive = pathName === link.route; // Active link check

                return (
                  <SheetClose asChild key={link.route}>
                    <Link
                      href={link.route}
                      className={cn('flex gap-4 items-center p-4 rounded-lg', {
                        'bg-blue-1': isActive, // Highlight active link
                      })}
                    >
                      <Image src={link.imgUrl} alt={link.label} width={24} height={24} />
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav;
