'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, PersonIcon, GearIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Sparkles } from 'lucide-react'

const navigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'メンバー', href: '/members', icon: PersonIcon },
  { name: 'マネジメントスタイル分析', href: '/analysis', icon: Sparkles },
  { name: '設定', href: '/settings', icon: GearIcon },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* デスクトップナビゲーション */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">
              1on1アシスタント
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'transition-colors hover:text-foreground/80',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  )}
                >
                  <span className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>

        {/* モバイルナビゲーション */}
        <div className="flex items-center md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">1on1アシスタント</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-2 focus:outline-none"
                aria-label="メニューを開く"
              >
                <HamburgerMenuIcon className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link 
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-2 w-full p-2',
                        pathname === item.href
                          ? 'bg-accent/50'
                          : ''
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
    </header>
  )
} 