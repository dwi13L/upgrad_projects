package dev.wi13l.booking.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "booking")
public class BookingInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int bookingId;

    // User Input - nullable by default
    private LocalDate fromDate;
    private LocalDate toDate;
    private String aadharNumber;
    private Integer numOfRooms;

    // Generated
    private String roomNumbers;

    // Calculated
    @Column(nullable = false)
    private int roomPrice;

    // Received from payment service
    @Column(columnDefinition = "integer default 0")
    private int transactionId;

    // Time of booking
    private LocalDateTime bookedOn;

}
