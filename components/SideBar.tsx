'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { IceCream, LayoutDashboard, LucideIcon, UsersIcon, BoxSelect, CreditCard, Paperclip } from "lucide-react";
import { Key } from "react";

type NavProps = {
    id: Key;
    title: string;
    href: string;
    icon: LucideIcon;
    type: string;
}

const items: NavProps[] = [
    {
        id: 1,
        title: 'Main',
        icon: IceCream,
        href: '',
        type: 'sep'
    },
    {
        id: 2,
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/',
        type: 'link'
    },
    {
        id: 3,
        title: 'App',
        icon: IceCream,
        href: '',
        type: 'sep'
    },
    {
        id: 4,
        title: 'Categories',
        icon: BoxSelect,
        href: '/categories',
        type: 'link'
    },
    {
        id: 5,
        title: 'Lotteries',
        icon: Paperclip,
        href: '/lotteries',
        type: 'link'
    },
    {
        id: 6,
        title: 'Payments',
        icon: CreditCard,
        href: '/payments',
        type: 'link'
    },
    {
        id: 7,
        title: 'Staff',
        icon: IceCream,
        href: '',
        type: 'sep'
    },
    {
        id: 8,
        title: 'Employees',
        icon: UsersIcon,
        href: '/',
        type: 'link'
    }
]

export default function SideNavbar() {
    const pathname = usePathname()

    return (
        <div className="w-72 h-screen items-center flex flex-col">
            <span className="text-lg font-bold mt-5 pt-5">PRIZE-EX</span>
            {items.map(items => (
                items.type == 'sep' ? <text className="text-left w-48 mb-0 mt-5" key={items.id}>{items.title}</text> :
                    <div key={items.id} className={`justify-start items-center flex-row flex min-w-52 mt-2 ml-2 h-12 pl-2 rounded-lg ${items.href == pathname.replace('/dashboard', '') ? 'bg-black text-white hover:text-white hover:bg-black' : 'bg-white text-black hover:text-white hover:bg-black'}`}>
                        <items.icon className="mr-2" />
                        <Link as={items} href={pathname == '/dashboard' ? `dashboard${items.href}` : '.' + items.href}>{items.title}</Link>
                    </div>
            ))}
        </div>
    )
}