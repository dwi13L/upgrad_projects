package dev.wi13l.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDetailsDto {
    private int transactionId;
    private String paymentMode;
    private int bookingId;
    private String upiId;
    private String cardNumber;
}
