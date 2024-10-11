"use client"
import { sidebarLinks } from '@/app/(root)/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import MobileNav from './MobileNav'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const Navbar = () => {
     const pathName = usePathname();
  return (
    <nav className='flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10'>
      <Link href = "/" className='flex items-center gap-3 '>
      <Image src={"/icons/logo.svg"} width={32} height={32 } alt='logo'/> 
      <p className=' text-white font-bold text-2xl max-sm:hidden'>Zoom</p></Link> 

     <div className='flex-between gap-5'>
      <SignedIn><UserButton/></SignedIn>
      <SignedOut> </SignedOut>
      <MobileNav/>
     </div>
     
    
    </nav>
  )
}

export default Navbar