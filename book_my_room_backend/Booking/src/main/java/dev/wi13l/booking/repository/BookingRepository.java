package dev.wi13l.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.wi13l.booking.entity.BookingInfoEntity;

@Repository
public interface BookingRepository extends JpaRepository<BookingInfoEntity, Integer> {

}
