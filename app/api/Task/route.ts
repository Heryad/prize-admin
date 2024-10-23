import { NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import Task from '../models/task';

export async function GET() {
  await dbConnect();
  const mResp = await Task.find({});
  return NextResponse.json(mResp);
}

export async function POST(request: Request) {
  const body = await request.json();
  await dbConnect();
  const mResp = await Task.create(body);
  return NextResponse.json(mResp);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await dbConnect();
  await Task.findByIdAndDelete(body._id);
  return NextResponse.json({ message: 'Payment deleted successfully' });
}