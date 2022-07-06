package dev.wi13l.payment.dto;

public final class TransactionNotFoundException {
    public final String message = "Invalid Transaction Id";
    public final int statusCode = 400;
}
