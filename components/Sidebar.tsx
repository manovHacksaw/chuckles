"use client"

import { sidebarLinks } from '@/app/(root)/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const Sidebar = () => {
     const pathName = usePathname()
  return (
    <section className='sticky left-0 top-0 flex h-screen flex-col w-fit bg-dark-1 justify-between p-6 pt-28 text-white max-sm:hidden lg:w-[260px]'>
     <div className="flex flex-col gap-6">
     {sidebarLinks.map((link) => {
          const isActive = (pathName === link.route );
          return (
            <Link key={link.label} href={link.route} className={cn('flex gap-4 items-center p-4 rounded-lg', {
               'bg-blue-1': isActive
            })}>
            <Image src={link.imgUrl} alt={link.label} width={24} height={24}/> {link.label}
            </Link>
          );
        })}
     </div>
    </section>
  )
}
