'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { SearchIcon, Search, PhoneCall } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/ui/progressIndicator";

type DataKey = {
  _id: string;
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
        <Image alt='1' src={row.getValue('imagePath')} width={80} height={80} className="max-w-[80px] max-h-[80px]" />
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
    accessorKey: "lotteryStatus",
    header: "Customer",
    cell: ({ row }) => {
      return <>
        {row.getValue('lotteryStatus') !== 'pending' ? <Button><PhoneCall /></Button> : <></>}
      </>
    }
  }
];

export default function Home() {
  const [dataLoading, setDataLoading] = useState(false);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    setDataLoading(true);
    const response = await fetch('/api/Lottery')
    const mData = await response.json();
    setData(mData);
    setDataLoading(false);
  }

  useEffect(() => {
    fetchData();
    fetchDialogData();
  }, [])

  const [lotteryData, setLotteryData] = useState([{ itemName: '', itemDate: '', _id: '' }]);
  const [ticketData, setTicketData] = useState([{ userName: 'Pending', _id: 'Pending', ticketQty: '0' }]);

  const [lotteryID, setLotteryID] = useState('');
  const [ticketID, setTicketID] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchDialogData = async () => {
    const response = await fetch('/api/Winner')
    const mData = await response.json();
    setLotteryData(mData);
  }

  const fetchTicketData = async (lotteryID: string) => {
    setIsLoading(true);
    const rs = await fetch('/api/Winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemID: lotteryID })
    })
    if (rs.status == 200) {
      setIsLoading(false);
      const mrs = await rs.json();
      setTicketData(mrs);
      setLotteryID(lotteryID);
    }
  }

  const [randomID, setRandomID] = useState(99999999999);
  const [winnerLoading, setWinnerLoading] = useState(false);
  const selectRandom = () => {
    setWinnerLoading(true);
    const randomIndex = Math.floor(Math.random() * ticketData.length)
    setRandomID(randomIndex);
    setTimeout(() => {
      setWinnerLoading(false);
    }, 2000);
  }

  const [ticketUpdate, setTicketUpdate] = useState(false);
  const setWinner = async () => {
    setTicketUpdate(true);
    const rs = await fetch('/api/Winner', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lotteryID: lotteryID, ticketID: ticketID })
    })
    if (rs.status == 200) {
      setIsLoading(false);
      const mrs = await rs.json();
      console.log(mrs);
      setLotteryID('');
      setTicketID('');
      setTicketUpdate(false);
      setOpen(false);
      window.location.reload();
    }
  }

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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-40 h-12 bg-teal-600" size="icon" disabled={dataLoading}>
                Select Winner
                <Search className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader className="items-center">
                <DialogTitle>Select Lottery Winner</DialogTitle>
                <DialogDescription>
                  Select Lottery ID & the winner
                </DialogDescription>
              </DialogHeader>
              <div className="flex row-auto items-center justify-center">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Lottery Ticket
                    </Label>
                    <Select onValueChange={(value) => { fetchTicketData(value); }}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Lottery" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Lottery Name</SelectLabel>
                          {lotteryData.map((type, index) => (
                            <SelectItem key={index} value={type._id}>
                              {type.itemName} | {type.itemDate}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Winner
                    </Label>

                    <Select onValueChange={(value) => { setTicketID(value) }} disabled={isLoading}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={isLoading ? 'Please Wait ...' : 'Select Winner'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{randomID == 99999999999 ? 'Winner Name' : 'Winner : ' + ticketData[randomID].userName}</SelectLabel>
                          {randomID == 99999999999 ?
                            <>
                              {ticketData.map((type, index) => (
                                <SelectItem key={index} value={type._id}>
                                  {type.userName} | X{type.ticketQty}
                                </SelectItem>
                              ))}
                            </>
                            :
                            <>
                              <SelectItem key={randomID} value={ticketData[randomID]._id}>
                                {ticketData[randomID].userName} | X{ticketData[randomID].ticketQty}
                              </SelectItem>
                            </>
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-orange-500 text-white font-bold" disabled={winnerLoading} onClick={() => { selectRandom() }}>{winnerLoading ? <span className="flex flex-row justify-center items-center"><ProgressIndicator className="mr-2" color="white"/> Select Random Winner</span> : 'Select Random Winner'}</Button>
                <Button type="submit" onClick={() => { setWinner() }} disabled={ticketUpdate}>{ticketUpdate ? 'Please Wait ...' : 'Save Progress'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section className="mt-10">
          {dataLoading ? <ProgressIndicator /> : <DataTable
            columns={columns}
            data={data}
          />}
        </section>
      </section>
    </div>
  );
}
