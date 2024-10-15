import { NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import Banner from '../models/banner';

export async function GET() {
  await dbConnect();
  const mResp = await Banner.find({});
  return NextResponse.json(mResp);
}

export async function POST(request: Request) {
  const body = await request.json();
  await dbConnect();
  const mResp = await Banner.create(body);
  return NextResponse.json(mResp);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await dbConnect();
  await Banner.findByIdAndDelete(body._id);
  return NextResponse.json({ message: 'User deleted successfully' });
}