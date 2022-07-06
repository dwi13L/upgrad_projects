package dev.wi13l.booking.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import dev.wi13l.booking.dto.TransactionDTO;
import dev.wi13l.booking.entity.BookingInfoEntity;
import dev.wi13l.booking.repository.BookingRepository;
import dev.wi13l.booking.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService {

    private BookingRepository repository;
    private ModelMapper mapper;
    private RestTemplate restTemplate;

    public BookingServiceImpl(BookingRepository repository, ModelMapper mapper, RestTemplate restTemplate) {
        this.repository = repository;
        this.mapper = mapper;
        this.restTemplate = restTemplate;
    }

    /**
     * Implementation of Interface methods
     */

    public BookingInfoEntity createBooking(BookingInfoEntity bookingRequest) {
        // Setting booking date
        bookingRequest.setBookedOn(LocalDateTime.now());

        // Setting room numbers
        bookingRequest.setRoomNumbers(getRoomNumbers(bookingRequest.getNumOfRooms()));

        // Setting Price for the particular booking
        bookingRequest.setRoomPrice(calculateBookingValue(bookingRequest));

        return repository.save(bookingRequest);
    }

    @Override
    public List<BookingInfoEntity> getBooking() {
        return repository.findAll();
    }

    @Override
    public BookingInfoEntity getBooking(int bookingId) {
        Optional<BookingInfoEntity> response = repository.findById(bookingId);
        if (response.isEmpty()) {
            return null;
        }
        return response.get();
    }

    @Override
    public BookingInfoEntity updateBooking(int bookingId, BookingInfoEntity bookingUpdateRequest) {
        BookingInfoEntity retrievedBooking = getBooking(bookingId);

        // assign values of update request to retrieved booking
        retrievedBooking = mapper.map(bookingUpdateRequest, BookingInfoEntity.class);
        return repository.save(retrievedBooking);
    }

    @Override
    public BookingInfoEntity deleteBooking(int bookingId) {
        BookingInfoEntity retrievedBooking = getBooking(bookingId);
        repository.deleteById(bookingId);
        return retrievedBooking;
    }

    /**
     * REST call to retrieve transaction id from PAYMENT-SERVICE
     */

    @Override
    public BookingInfoEntity processPayment(int id, TransactionDTO transactionDTO) {

        String paymentURI = "http://localhost:9191/payment/transaction";

        Integer transactionId = restTemplate.postForObject(paymentURI, transactionDTO, Integer.class);

        BookingInfoEntity retrievedBooking = getBooking(id);

        retrievedBooking.setTransactionId(transactionId);

        BookingInfoEntity updatedBooking = updateBooking(id, retrievedBooking);

        // Printing confirmation message to console

        String message = "Booking confirmed for user with aadhaar number: "
                + updatedBooking.getAadharNumber()
                + "    |    "
                + "Here are the booking details:    " + updatedBooking.toString();
        System.out.println("\n------------------------------- Booking Confirmation -------------------------------");
        System.out.println(message);
        System.out.println("\n-------------------------------> x <-------------------------------");

        return updatedBooking;
    }

    /**
     * Utility Methods
     */

    private int calculateBookingValue(BookingInfoEntity entity) {
        LocalDate from = entity.getFromDate();
        LocalDate to = entity.getToDate();
        Period stayDuration = Period.between(from, to);
        return stayDuration.getDays() * entity.getNumOfRooms() * 1000;
    }

    private String getRoomNumbers(int numberOfRooms) {
        Random rand = new Random();
        StringBuilder rooms = new StringBuilder();
        int upperBound = 100;

        for (int i = 0; i < numberOfRooms; i++) {
            rooms.append(rand.nextInt(upperBound) + ",");
        }

        rooms = rooms.deleteCharAt(rooms.length() - 1);

        return rooms.toString();
    }

}
