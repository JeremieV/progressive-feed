"use client"

import ControlBar from "./ControlBar"
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button"
import { faviconUrl } from "@/lib/helpers";

import { Input } from "@/components/ui/input";
// import { displayUrl, urlToRSS } from "@/lib/helpers"
import React, { useState, useRef } from 'react'
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import Link from "next/link";
import { useAtom } from "jotai";
import { subscriptionsAtom } from "@/lib/state";
import { useRouter } from "next/navigation";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [subscriptions] = useAtom(subscriptionsAtom)
  const router = useRouter();

  async function gotoFeedPage() {
    // navigate to `/feed/${encodeURIComponent(inputValue)}
    if (inputValue.trim() !== "") {
      const encodedUrl = encodeURIComponent(inputValue);
      await router.push(`/feed/${encodedUrl}`);
    }
  }

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // validate url
      gotoFeedPage()
    }
  }

  const Logo = () => (
    <div className="h-16 flex items-center">
      <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu />
      </Button>
      <div>
        <h1 className="text-xl font-bold"><a href="/">OpenFeed</a></h1>
      </div>
    </div>
  )

  const SideBar = () => (
    <div className="h-svh overflow-hidden sticky top-0 flex flex-col px-4 bg-card border-r">
      <Logo />
      <p className='p-8 mb-4 text-sm text-center bg-muted rounded-md text-muted-foreground'>
        <a href="https://github.com/jeremiev/feed" className='underline'>Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a>
      </p>
      <h2 className="font-semibold mb-2">Subscriptions</h2>
      {subscriptions.map(s => (
        <Link onClick={() => setSidebarOpen(false)} href={`/feed/${encodeURIComponent(s.url)}`} className={`${buttonVariants({ variant: "ghost" })} !justify-start gap-4 overflow-hidden`} key={s.url}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={faviconUrl(s.url)} alt="" className="aspect-square w-6 h-6 rounded-md" />
          <span>{s.name}</span>
        </Link>
      ))}
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop transition className="fixed inset-0 bg-black/60 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" />
        <div className="fixed inset-0 flex">
          <DialogPanel transition className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full">
            <SideBar />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SideBar />
      </div>

      {/* Main content area */}
      <div className="lg:pl-72">
        <div className="max-w-6xl mx-auto">
          {/* header */}
          <div className="sticky top-0 z-40 bg-card px-4">
            <div className="flex h-16 shrink-0 items-center gap-x-2">
              <div className="lg:hidden">
                <Logo />
              </div>
              <Input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter RSS feed url (or youtube, medium, substack, reddit...)"
              />
              <Button variant="secondary" onClick={() => gotoFeedPage()}>Search</Button>
            </div>
            <div className="pb-4 mb-1">
              <ControlBar />
            </div>
          </div>

          <main className="flex flex-col pb-4 px-4" id='top'>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
