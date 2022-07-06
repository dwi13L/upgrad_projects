package dev.wi13l.booking.constants;

public enum PaymentModes {
    UPI, CARD;

    public static boolean contains(String test) {
        for (PaymentModes p : PaymentModes.values()) {
            if (p.name().equals(test))
                return true;
        }
        return false;
    }
}
