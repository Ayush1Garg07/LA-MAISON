package com.lamaison.repository;

import com.lamaison.entity.Reservation;
import com.lamaison.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByOrderByDateAscTimeAsc();

    @Query("SELECT r FROM Reservation r WHERE r.table = :table AND r.date = :date AND r.time = :time AND r.status <> 'cancelled'")
    List<Reservation> findConflicting(
        @Param("table") RestaurantTable table,
        @Param("date") LocalDate date,
        @Param("time") String time
    );
}
