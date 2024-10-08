"use client";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Pen,
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

type DataKey = {
    _id: string;
    nameEN: string;
    nameTR: string;
    imagePath: string;
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
                <Image alt='1' src={row.getValue('imagePath')} width={100} height={100} className="max-w-[100px] max-h-[100px]"/>
            );
        },
    },
    {
        accessorKey: "nameEN",
        header: "Category - English",
    },
    {
        accessorKey: "nameTR",
        header: "Category - Turkish",
    },
    {
        accessorKey: "function",
        header: "Functions",
        cell: ({ row }) => {
            return (
                <div className="flex">
                    <div className="bg-teal-700 w-10 h-10 flex items-center justify-center mr-2 rounded-md p-2 cursor-pointer">
                        <Pen color="white" />
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className="bg-red-700 w-10 h-10 flex items-center justify-center mr-2 rounded-md p-2 cursor-pointer"><X color="white" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete {row.getValue('nameEN')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    fetch('../../api/Category', {
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

    const [data, setData] = useState<DataKey | any>([]);

    function handleSearch(term: string) {
        let mData = data;
        mData = data.filter((data: { nameEN: string; }) =>
            data.nameEN.toLocaleLowerCase().includes(term.toLocaleLowerCase())
        )
        setSearchData(mData);
    }

    const [catNameEN, setCatNameEN] = useState('');
    const [catNameTR, setCatNameTR] = useState('');
    const [imageBase, setImageBase] = useState('');
    const [open, setOpen] = useState(false);

    const insertCategory = async () => {
        setIsLoading(true);
        const rs = await fetch('../../api/Category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nameEN: catNameEN, nameTR: catNameTR, imagePath: imageBase })
        })
        if (rs.status == 200) {
            setCatNameEN('');
            setCatNameTR('');
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
        const response = await fetch('../../api/Category')
        const mData = await response.json();
        setData(mData);
        console.log(mData);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <main className="m-5 p-10 bg-white rounded-xl">
            <h2 className="font-bold text-2xl mb-2">Categories</h2>
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
                            <Button className="w-40 ml-5 bg-teal-600" size="icon">
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
                                        <Label htmlFor="name" className="text-right">
                                            Title EN
                                        </Label>
                                        <Input id="name" className="col-span-3" value={catNameEN} onChange={e => { setCatNameEN(e.currentTarget.value) }} />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Title TR
                                        </Label>
                                        <Input id="name" className="col-span-3" value={catNameTR} onChange={e => { setCatNameTR(e.currentTarget.value) }} />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="icon" className="text-right">
                                            Icon
                                        </Label>
                                        <Input id="icon" className="col-span-3" type="file" onChange={handleFileChange} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => { insertCategory(); }} disabled={isLoading}>{isLoading ? 'Please Wait ...' : 'Save changes'}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <DataTable
                    columns={columns}
                    data={searchData.length >= 1 ? searchData : data}
                />
            </div>
        </main>
    );
}
