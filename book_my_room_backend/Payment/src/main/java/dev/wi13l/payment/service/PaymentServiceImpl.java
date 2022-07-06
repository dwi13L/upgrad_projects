package dev.wi13l.payment.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.wi13l.payment.entity.TransactionDetailsEntity;
import dev.wi13l.payment.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {
    private PaymentRepository repository;

    public PaymentServiceImpl(PaymentRepository repository) {
        this.repository = repository;
    }

    @Override
    public TransactionDetailsEntity processPayment(TransactionDetailsEntity paymentRequest) {

        return repository.save(paymentRequest);
    }

    @Override
    public TransactionDetailsEntity getPaymentDetails(int id) {

        Optional<TransactionDetailsEntity> response = repository.findById(id);
        if (response.isEmpty()) {
            return null;
        }
        return response.get();
    }

}
