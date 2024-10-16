"use client";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image";

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressIndicator } from "@/components/ui/progressIndicator";

type DataKey = {
    _id: string;
    itemName: string;
    itemPrice: string;
    itemDate: string;
    imagePath: string;
    drawRules: string;
    itemQuantity: string;
    itemSoldQuantity: string;
    itemCategory: string;
};

const columns: ColumnDef<DataKey>[] = [
    {
        accessorKey: "_id",
        header: "ID",
    },
    {
        accessorKey: 'imagePath',
        header: 'Image',
        cell: ({ row }) => {
            return (
                <Image alt='1' src={row.getValue('imagePath')} width={100} height={100} className="max-w-[100px] max-h-[100px]" />
            );
        },
    },
    {
        accessorKey: "itemCategory",
        header: "Category",
    },
    {
        accessorKey: "itemName",
        header: "Name",
    },
    {
        accessorKey: "itemPrice",
        header: "Price",
    },
    {
        accessorKey: "itemDate",
        header: "Lottery Date",
    },
    {
        accessorKey: "drawRules",
        header: "Desc",
        cell: ({ row }) => {
            return (
                <span className="line-clamp-1">{row.getValue('drawRules')}</span>
            )
        }
    },
    {
        accessorKey: "itemQuantity",
        header: "Tickets Left",
    },
    {
        accessorKey: "itemSoldQuantity",
        header: "Tickets Sold",
    },
    {
        accessorKey: "function",
        header: "Functions",
        cell: ({ row }) => {
            return (
                <div className="flex">
                    {/* <div className="bg-teal-700 w-10 h-10 flex items-center justify-center mr-2 rounded-md p-2 cursor-pointer">
                        <Pen color="white" />
                    </div> */}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className="bg-red-700 w-10 h-10 flex items-center justify-center mr-2 rounded-md p-2 cursor-pointer"><X color="white" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete {row.getValue('itemName')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    fetch('../../api/Lottery', {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ _id: row.getValue('_id') })
                                    }).then(response => response.json())
                                        .then(data => {
                                            console.log(data);
                                            window.location.reload();
                                        });
                                }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
    },
];


export default function UsersPage() {
    const [searchData, setSearchData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    const [data, setData] = useState<DataKey | any>([]);

    function handleSearch(term: string) {
        let mData = data;
        mData = data.filter((data: { nameEN: string; }) =>
            data.nameEN.toLocaleLowerCase().includes(term.toLocaleLowerCase())
        )
        setSearchData(mData);
    }

    const [sCat, setSCat] = useState('');
    const [itemName, setItemName] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [date, setDate] = React.useState<Date>()
    const [drawRules, setDrawRules] = useState('');
    const [ticketQty, setTicketQty] = useState('');
    const [imageBase, setImageBase] = useState('');
    const [open, setOpen] = useState(false);

    const insertLottery = async () => {
        setIsLoading(true);
        const rs = await fetch('../../api/Lottery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemName: itemName, itemPrice: ticketPrice, itemDate: date ? format(date, "dd/MM/yyyy") : '', imagePath: imageBase, drawRules: drawRules, itemQuantity: ticketQty, itemSoldQuantity: '0', itemCategory: sCat, lotteryStatus: 'pending', lotteryWinner: 'n/a' })
        })
        if (rs.status == 200) {
            setItemName('');
            setTicketPrice('');
            setDrawRules('');
            setTicketQty('');
            setImageBase('');
            setOpen(false);
            setIsLoading(false);
            fetchData();
        }
    }

    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                const base64 = await convertToBase64(file)
                setImageBase(base64)
            } catch (error) {
                console.error("Error converting file to base64:", error)
                setImageBase("Error converting file to base64")
            }
        }
    }

    const fetchData = async () => {
        setDataLoading(true);
        const response = await fetch('../../api/Lottery')
        const mData = await response.json();
        setData(mData);
        setDataLoading(false);
    }

    const [catData, setCatData] = useState([{ nameEN: 'Pending ...', _id: '0x' }]);
    const getCatData = async () => {
        const response = await fetch('../../api/Category')
        const mData = await response.json();
        setCatData(mData);
    }

    useEffect(() => {
        fetchData();
        getCatData();
    }, [])

    return (
        <main className="m-5 p-10 bg-white rounded-xl">
            <h2 className="font-bold text-2xl mb-2">Lotteries</h2>
            <div className="flex flex-col gap-5  w-full">
                <div className="flex row-auto">
                    <Input
                        placeholder="Search ..."
                        className="w-52 mr-2"
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                    />
                    <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-40 ml-5 bg-teal-600" size="icon" disabled={dataLoading}>
                                Add
                                <Plus className="h-4 w-4 ml-2" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add Category</DialogTitle>
                                <DialogDescription>
                                    enter category details then press save.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex row-auto">
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="year" className="text-right">
                                            Category
                                        </Label>
                                        <Select onValueChange={(value) => { setSCat(value) }}>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Category</SelectLabel>
                                                    {catData.map((type) => (
                                                        <SelectItem key={type._id} value={type.nameEN.toString()}>
                                                            {type.nameEN}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Item Name
                                        </Label>
                                        <Input id="name" className="col-span-3" value={itemName} onChange={e => { setItemName(e.currentTarget.value) }} />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Ticket Price
                                        </Label>
                                        <Input id="name" className="col-span-3" type="number" value={ticketPrice} onChange={e => { setTicketPrice(e.currentTarget.value) }} />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Lottery Date
                                        </Label>
                                        <div className="">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[280px] justify-start text-left font-normal",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Draw Rules
                                        </Label>
                                        <Input id="name" className="col-span-3 h-32" value={drawRules} onChange={e => { setDrawRules(e.currentTarget.value) }} />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Ticket Quantity
                                        </Label>
                                        <Input id="name" className="col-span-3" type="number" value={ticketQty} onChange={e => { setTicketQty(e.currentTarget.value) }} />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Image
                                        </Label>
                                        <Input id="icon" className="col-span-3" type="file" onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => { insertLottery(); }} disabled={isLoading}>{isLoading ? 'Please Wait ...' : 'Save changes'}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                {dataLoading ? <ProgressIndicator /> : <DataTable
                    columns={columns}
                    data={searchData.length >= 1 ? searchData : data}
                />}
            </div>
        </main>
    );
}
