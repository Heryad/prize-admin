'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { SearchIcon, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DataKey = {
  itemName: string;
  itemPrice: string;
  imagePath: string;
  itemDate: string;
  itemSoldQuantity: string;
  itemCategory: string;
  lotteryStatus: string;
  lotteryWinner: string;
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
    accessorKey: "itemName",
    header: "Lottery",
  },
  {
    accessorKey: "itemDate",
    header: "Date Of Lottery",
  },
  {
    accessorKey: "itemPrice",
    header: "Price",
  },
  {
    accessorKey: "itemSoldQuantity",
    header: "Sold Tickets"
  },
  {
    accessorKey: "lotteryStatus",
    header: "Status",
    cell: ({ row }) => {
      return <span className={`p-3 rounded-lg text-white font-bold ${row.getValue('lotteryStatus') == 'pending' ? 'bg-red-600' : 'bg-green-500'}`}>{row.getValue('lotteryStatus')}</span>
    }
  },
  {
    accessorKey: "function",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-12 bg-teal-600" size="icon">
                <Check className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Select Winner For {row.getValue('itemName')}</DialogTitle>
                <DialogDescription>
                  enter winner details then press save.
                </DialogDescription>
              </DialogHeader>
              <div className="flex row-auto">
                <div className="grid gap-4 py-4">
                  <Select>
                    <SelectTrigger className="col-span-1 w-36">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Winner</SelectLabel>
                          <SelectItem key={1} value={'Ata'}>
                            Ata
                          </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => { }}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
];

export default function Home() {

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await fetch('/api/Lottery')
    const mData = await response.json();
    setData(mData);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="flex flex-col w-full">
      <section className="flex bg-white m-5 border-1 rounded-xl p-10 flex-col">

        <section className="flex flex-row w-full items-center">
          <h2 className="font-bold text-2xl">Lotteries</h2>
          <div className="flex flex-row items-center content-center gap-x-5 ml-auto">
            <div className="flex w-full max-w-sm h-12 items-center bg-[#F8F8F8] rounded-[10px] ml-10">
              <SearchIcon className="h-6 w-6 ml-2" />
              <Input type="text" placeholder="Enter your text..." className="border-none h-12" />
            </div>
          </div>
        </section>

        <section className="flex flex-row w-full items-center mt-5 gap-x-5">
          <Select>
            <SelectTrigger className="col-span-10 h-12">
              <SelectValue placeholder="Select Lottery Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Types</SelectLabel>
                <SelectItem value="fixed">Pending</SelectItem>
                <SelectItem value="flexible">Proccessed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>

        <section className="mt-10">
          <DataTable
            columns={columns}
            data={data}
          />
        </section>
      </section>
    </div>
  );
}
