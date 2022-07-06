package dev.wi13l.booking.service;

import java.util.List;

import dev.wi13l.booking.dto.TransactionDTO;
import dev.wi13l.booking.entity.BookingInfoEntity;

public interface BookingService {

    BookingInfoEntity createBooking(BookingInfoEntity bookingRequest);

    List<BookingInfoEntity> getBooking();

    BookingInfoEntity getBooking(int bookingId);

    BookingInfoEntity updateBooking(int bookingId, BookingInfoEntity booking);

    BookingInfoEntity deleteBooking(int bookingId);

    BookingInfoEntity processPayment(int id, TransactionDTO transactionDTO);

}
