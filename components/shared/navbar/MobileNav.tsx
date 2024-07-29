"use client";

import {
    Sheet, SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {SignedOut} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {sidebarLinks} from "@/constants";
import {usePathname} from "next/navigation";

const NavContent = () => {
    const pathname = usePathname()

    return (
        <section className="flex flex-col gap-6 h-full pt-16">
            {sidebarLinks.map((item) => {

                const isActive = (pathname.includes(item.route) && item.route.length > 1 || pathname === item.route);


                return (
                    <SheetClose asChild key={item.label}>
                        <Link href={item.route}
                              className={`${isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark300_light900'} flex items-center justify-start gap-4 bg-transparent p-4`}>
                            <Image src={item.imgURL} width={20} height={20} alt={item.label} className={`${isActive ? '' : 'invert-colors'}`}/>
                            <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>{item.label}</p>
                        </Link>
                    </SheetClose>
                )
            })}
        </section>
    )
}

const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image src={"/assets/icons/hamburger.svg"} className="invert-colors sm:hidden" width={23} height={34}
                       alt="Hamburger Icon"/>
            </SheetTrigger>
            <SheetContent side="left" className="background-light900_dark200 border-light-900 border-none ">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/assets/images/site-logo.svg" width={24} height={24} alt="DevFlow Logo"/>
                    <p className="h2-bold text-dark100_light900 font-spaceGrotesk ">Dev<span
                        className="text-primary-500">OverFlow</span></p>
                </Link>
                <div>
                    <SheetClose asChild>
                        <NavContent/>
                    </SheetClose>

                    <SignedOut>
                        <div className="flex flex-col gap-3">
                            <SheetClose asChild>
                                <Link href="/sign-in">
                                    <Button
                                        className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none ">
                                        <span className="primary-text-gradient">Log In</span>
                                    </Button>
                                </Link>
                            </SheetClose>

                            <SheetClose asChild>
                                <Link href="/sign-up">
                                    <Button
                                        className="small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none text-dark400_light900">
                                        Sign Up
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    </SignedOut>
                </div>
            </SheetContent>
        </Sheet>

    )
}

export default MobileNav