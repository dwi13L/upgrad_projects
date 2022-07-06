package dev.wi13l.payment.entity;

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
@Table(name = "transaction")
public class TransactionDetailsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int transactionId;

    private String paymentMode;

    @Column(nullable = false)
    private int bookingId;

    private String upiId;
    private String cardNumber;
}
