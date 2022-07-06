package dev.wi13l.payment.service;

import dev.wi13l.payment.entity.TransactionDetailsEntity;

public interface PaymentService {
    TransactionDetailsEntity processPayment(TransactionDetailsEntity paymentRequest);

    TransactionDetailsEntity getPaymentDetails(int id);
}
