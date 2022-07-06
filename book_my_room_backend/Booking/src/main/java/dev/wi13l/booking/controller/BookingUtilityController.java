package dev.wi13l.booking.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hotel")
public class BookingUtilityController implements ErrorController {

    /**
     * ErrorController
     */

    @GetMapping(value = "/error")
    public ResponseEntity<HttpStatus> defaultErrorHandler() {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @GetMapping(value = "/test")
    public ResponseEntity<String> bookingCtrlTest() {
        return new ResponseEntity<>("Response From Booking", HttpStatus.OK);
    }

}
