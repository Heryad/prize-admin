import { NextResponse } from 'next/server';
import dbConnect from '../lib/db';
import Payment from '../models/payment';
import User from '../models/user';

export async function GET() {
  await dbConnect();
  const mResp = await Payment.find({});
  return NextResponse.json(mResp);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await dbConnect();
  await Payment.findByIdAndDelete(body._id);
  return NextResponse.json({ message: 'Payment deleted successfully' });
}

export async function POST(request: Request) {
  const body = await request.json();
  await dbConnect();
  const mResp = await Payment.findById(body._id);
  if (mResp) {
    const userResp = await User.find({telegramID: body.userID});

    const prevBalance = userResp[0].userBalance;
    const newBalance = parseInt(prevBalance) + parseInt(mResp.paymentAmount);
    console.debug(newBalance);
    const updatedBalance = await User.findOneAndUpdate(
      { telegramID: body.userID },
      {
        $set: {
          userBalance: newBalance,
        },
      },
      { new: true } // This option returns the updated document
    );

    const updatedStatus = await Payment.findOneAndUpdate(
      { _id: body._id },
      {
        $set: {
          paymentStatus: 'accepted',
        },
      },
      { new: true } // This option returns the updated document
    );

    return NextResponse.json({msg: 'ok', updatedBalance, updatedStatus});

  }else{
    console.debug('no');
  }
  return NextResponse.json({msg: 'ok'});
}

