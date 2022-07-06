package dev.wi13l.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.wi13l.payment.entity.TransactionDetailsEntity;

@Repository
public interface PaymentRepository extends JpaRepository<TransactionDetailsEntity, Integer> {

}
