package dev.wi13l.booking.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import dev.wi13l.booking.constants.PaymentModes;
import dev.wi13l.booking.dto.BookingInfoDto;
import dev.wi13l.booking.dto.BookingNotFoundExceptionDto;
import dev.wi13l.booking.dto.BookingRequestResponseDto;
import dev.wi13l.booking.dto.PaymentExceptionResponseDto;
import dev.wi13l.booking.dto.TransactionDTO;
import dev.wi13l.booking.entity.BookingInfoEntity;
import dev.wi13l.booking.service.BookingService;

@RestController
@RequestMapping("/hotel")
public class BookingController {

    private ModelMapper mapper;
    private BookingService service;

    public BookingController(ModelMapper mapper, BookingService service, RestTemplate restTemplate) {
        this.mapper = mapper;
        this.service = service;
    }

    /**
     * Required APIs
     */

    @PostMapping("/booking")
    public ResponseEntity<BookingRequestResponseDto> createBooking(@RequestBody BookingInfoDto bookingInfoDto) {

        System.out.println(bookingInfoDto.toString());
        BookingInfoEntity savedBooking = service.createBooking(mapper.map(bookingInfoDto, BookingInfoEntity.class));

        BookingRequestResponseDto response = mapper.map(savedBooking, BookingRequestResponseDto.class);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping(value = "/booking/{id}/transaction")
    public ResponseEntity<Object> processPayment(@PathVariable int id, @RequestBody TransactionDTO transactionDTO) {

        // Check for valid booking id
        BookingInfoEntity retrievedBooking = service.getBooking(id);
        if (retrievedBooking == null)
            return new ResponseEntity<>(new BookingNotFoundExceptionDto(), HttpStatus.BAD_REQUEST);

        // Check for valid mode of payment
        if (!PaymentModes.contains(transactionDTO.getPaymentMode()/* .toUpperCase().trim() */)) {
            return new ResponseEntity<>(new PaymentExceptionResponseDto(), HttpStatus.BAD_REQUEST);
        }

        BookingRequestResponseDto responseDto = mapper.map(service.processPayment(id, transactionDTO),
                BookingRequestResponseDto.class);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    /**
     * Additional Funcationality
     */

    @GetMapping(value = "/booking/{id}")
    public ResponseEntity<Object> getBooking(@PathVariable int id) {
        BookingInfoEntity response = service.getBooking(id);
        if (response == null) {
            return new ResponseEntity<>(new BookingNotFoundExceptionDto(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
