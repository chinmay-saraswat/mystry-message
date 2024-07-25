import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbconnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if(!session||!session.user){
    return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
  }

    const userId=user._id;
    const {acceptMessage}=await request.json();

    try {
      const updateUser=UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessage:acceptMessage},
        {new : true}
      );
      if (!updateUser) {
        // User not found
        return Response.json(
          {
            success: false,
            message: 'Unable to find user to update message acceptance status',
          },
          { status: 404 }
        );
      }
  
      // Successfully updated message acceptance status
      return Response.json(
        {
          success: true,
          message: 'Message acceptance status updated successfully',
          updateUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
    }

}

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}