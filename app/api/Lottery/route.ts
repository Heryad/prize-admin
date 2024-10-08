import { NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import Lottery from '../models/lottery';

export async function GET() {
  await dbConnect();
  const mResp = await Lottery.find({});
  return NextResponse.json(mResp);
}

export async function POST(request: Request) {
  const body = await request.json();
  await dbConnect();
  const mResp = await Lottery.create(body);
  return NextResponse.json(mResp);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await dbConnect();
  const mResp = await Lottery.findByIdAndUpdate(body._id, body, { new: true });
  return NextResponse.json(mResp);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await dbConnect();
  await Lottery.findByIdAndDelete(body._id);
  return NextResponse.json({ message: 'User deleted successfully' });
}