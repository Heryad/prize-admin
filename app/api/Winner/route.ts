import { NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import Lottery from '../models/lottery';
import Ticket from '../models/ticket';

export async function GET() {
  await dbConnect();
  const mResp = await Lottery.find({lotteryStatus: 'pending'});
  return NextResponse.json(mResp);
}

export async function POST(request: Request) {
    const body = await request.json();
    await dbConnect();
    const mResp = await Ticket.find({itemID: body.itemID});
    return NextResponse.json(mResp);
}

export async function PUT(request: Request) {
    const body = await request.json();
    await dbConnect();

    const ticketResp = await Ticket.findByIdAndUpdate(body.ticketID, {ticketStatus: 'Completed', ticketResult: 'won'}, { new: true });

    const mResp = await Lottery.findByIdAndUpdate(body.lotteryID, {lotteryStatus: 'completed', lotteryWinner: ticketResp.userName}, { new: true });
    console.log(mResp);

    const remainResp = await Ticket.updateMany(
      { 
        itemID: body.lotteryID,
        ticketStatus: 'Pending'
      },
      {
        $set: {
          ticketStatus: 'Completed',
          ticketResult: 'lose',
        },
      },
      { new: true } // This option returns the updated document
    );
    return NextResponse.json(remainResp);
}