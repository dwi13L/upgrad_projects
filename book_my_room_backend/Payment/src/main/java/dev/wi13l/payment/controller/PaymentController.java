package dev.wi13l.payment.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.wi13l.payment.dto.TransactionDetailsDto;
import dev.wi13l.payment.dto.TransactionNotFoundException;
import dev.wi13l.payment.entity.TransactionDetailsEntity;
import dev.wi13l.payment.service.PaymentService;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private PaymentService service;
    private ModelMapper mapper;

    public PaymentController(PaymentService service, ModelMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    /**
     * Required APIs
     */

    @PostMapping(value = "/transaction")
    public ResponseEntity<Integer> processTransaction(@RequestBody TransactionDetailsDto paymentRequestDto) {

        TransactionDetailsEntity paymentRequest = mapper.map(paymentRequestDto, TransactionDetailsEntity.class);

        return new ResponseEntity<>(service.processPayment(paymentRequest).getTransactionId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/transaction/{transactionId}")
    public ResponseEntity<Object> getTransaction(@PathVariable int transactionId) {
        TransactionDetailsEntity transaction = service.getPaymentDetails(transactionId);
        if (transaction == null) {
            return new ResponseEntity<>(new TransactionNotFoundException(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(
                mapper.map(transaction, TransactionDetailsDto.class), HttpStatus.OK);
    }

}
