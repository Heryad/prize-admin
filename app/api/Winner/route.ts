import { NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import Lottery from '../models/lottery';
import Ticket from '../models/ticket';

export async function GET() {
  await dbConnect();
  const mResp = await Lottery.find({});
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

    const ticketResp = await Ticket.findByIdAndUpdate(body.ticketID, {ticketStatus: 'completed', ticketResult: 'won'}, { new: true });

    const mResp = await Lottery.findByIdAndUpdate(body.lotteryID, {lotteryStatus: 'completed', lotteryWinner: ticketResp.userName}, { new: true });
    return NextResponse.json(mResp);
}