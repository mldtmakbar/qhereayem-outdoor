import { NextResponse } from 'next/server';
import type { Booking, BookingItem, ApiResponse } from '@/lib/types';

// Sample data - in a real app, this would come from a database
const bookings: Booking[] = [];

export async function GET(request: Request) {
  // Get URL parameters for filtering
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const status = url.searchParams.get('status');
  
  // Filter bookings based on query parameters
  let filteredBookings = [...bookings];
  
  if (userId) {
    filteredBookings = filteredBookings.filter(b => b.userId === parseInt(userId));
  }
  
  if (status) {
    filteredBookings = filteredBookings.filter(b => b.status === status);
  }

  // Create response using our types
  const response: ApiResponse<Booking[]> = {
    status: 'success',
    data: filteredBookings
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate that the body contains required fields
    if (!body.userId || !body.items || !body.startDate || !body.endDate) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing required booking information'
      }, { status: 400 });
    }

    // Prepare booking items
    const bookingItems: BookingItem[] = body.items.map((item: any, index: number) => ({
      id: Date.now() + index,
      bookingId: Date.now(),
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      priceAtBooking: item.product?.price || 0
    }));

    // Create a new booking
    const newBooking: Booking = {
      id: Date.now(),
      userId: body.userId,
      items: bookingItems,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      totalPrice: body.totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      customFields: body.customFields
    };

    // Add to bookings array (simulating database insert)
    bookings.push(newBooking);

    // Return success response
    const response: ApiResponse<Booking> = {
      status: 'success',
      data: newBooking,
      message: 'Booking created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create booking'
    }, { status: 500 });
  }
}
