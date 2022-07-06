package dev.wi13l.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonPropertyOrder("bookingId")
public class BookingRequestResponseDto {

    // Generated
    @JsonProperty("id")
    private int bookingId;

    // User Input - nullable by default
    private LocalDate fromDate;
    private LocalDate toDate;
    private String aadharNumber;
    // private Integer numOfRooms;

    // Generated
    private String roomNumbers;

    // Calculated
    private int roomPrice;

    // Received from payment service
    private int transactionId;

    // Time of booking
    private LocalDateTime bookedOn;
}
