"use client";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Check,
    Search,
    X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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

type DataKey = {
    _id: string;
    methodName: string;
    paymentAmount: string;
    paymentDate: string;
    userName: string;
    paymentStatus: string;
    userID: string;
};

const columns: ColumnDef<DataKey>[] = [
    {
        accessorKey: "_id",
        header: "ID",
    },
    {
        accessorKey: "methodName",
        header: "Method",
    },
    {
        accessorKey: "paymentAmount",
        header: "Amount ($)",
    },
    {
        accessorKey: "paymentDate",
        header: "Date",
    },
    {
        accessorKey: "userName",
        header: "User",
    },
    {
        accessorKey: "paymentStatus",
        header: "Status",
        cell: ({ row }) => {
            return (
                <span className={`p-3 rounded-xl text-white font-bold ${row.getValue('paymentStatus') == 'pending' ? 'bg-red-500' : 'bg-green-400'}`}>{row.getValue('paymentStatus')}</span>
            )
        }
    },
    {
        accessorKey: "userID",
        header: "TG",
    },
    {
        accessorKey: "function",
        header: "Functions",
        cell: ({ row }) => {
            return (
                <div className="flex">
                    {row.getValue('paymentStatus') == 'pending' ? <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className="bg-green-700 w-10 h-10 flex items-center justify-center mr-2 rounded-md p-2 cursor-pointer"><Check color="white" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will recharge {row.getValue('userName')}&apos;s account with amount of {row.getValue('paymentAmount')} $
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    fetch('../../api/Payments', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ _id: row.getValue('_id'), userID: row.getValue('userID') })
                                    }).then(response => response.json())
                                        .then(data => {
                                            console.log(data);
                                            window.location.reload();
                                        });
                                }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog> : <></>}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className="bg-red-700 w-10 h-10 flex items-center justify-center mr-2 rounded-md p-2 cursor-pointer"><X color="white" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete {row.getValue('_id')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    fetch('../../api/Payments', {
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

    const [data, setData] = useState<DataKey | any>([]);

    function handleSearch(term: string) {
        let mData = data;
        mData = data.filter((data: { nameEN: string; }) =>
            data.nameEN.toLocaleLowerCase().includes(term.toLocaleLowerCase())
        )
        setSearchData(mData);
    }

    const fetchData = async () => {
        const response = await fetch('../../api/Payments')
        const mData = await response.json();
        setData(mData);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <main className="m-5 p-10 bg-white rounded-xl">
            <h2 className="font-bold text-2xl mb-2">Payments</h2>
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
                </div>
                <DataTable
                    columns={columns}
                    data={searchData.length >= 1 ? searchData : data}
                />
            </div>
        </main>
    );
}
