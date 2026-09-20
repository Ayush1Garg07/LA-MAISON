package com.lamaison.config;

import com.lamaison.entity.Reservation;
import com.lamaison.entity.RestaurantTable;
import com.lamaison.entity.User;
import com.lamaison.repository.ReservationRepository;
import com.lamaison.repository.TableRepository;
import com.lamaison.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final TableRepository tableRepo;
    private final ReservationRepository resRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed users
        User admin = userRepo.save(User.builder()
            .name("Admin User").email("admin@bistro.com")
            .password(passwordEncoder.encode("admin123")).role(User.Role.admin).build());

        User john = userRepo.save(User.builder()
            .name("John Doe").email("john@email.com")
            .password(passwordEncoder.encode("john123")).role(User.Role.customer).build());

        // Seed tables
        List<RestaurantTable> tables = tableRepo.saveAll(List.of(
            RestaurantTable.builder().number("T1").capacity(2).zone("Window").build(),
            RestaurantTable.builder().number("T2").capacity(2).zone("Window").build(),
            RestaurantTable.builder().number("T3").capacity(4).zone("Main Hall").build(),
            RestaurantTable.builder().number("T4").capacity(4).zone("Main Hall").build(),
            RestaurantTable.builder().number("T5").capacity(6).zone("Main Hall").build(),
            RestaurantTable.builder().number("T6").capacity(8).zone("Private").build(),
            RestaurantTable.builder().number("T7").capacity(4).zone("Terrace").build(),
            RestaurantTable.builder().number("T8").capacity(2).zone("Terrace").build()
        ));

        // Seed reservations
        resRepo.saveAll(List.of(
            Reservation.builder().user(john).table(tables.get(2))
                .date(LocalDate.now().plusDays(1)).time("19:00").guests(3)
                .status(Reservation.Status.confirmed).note("Anniversary dinner").build(),
            Reservation.builder().user(john).table(tables.get(5))
                .date(LocalDate.now().plusDays(1)).time("20:30").guests(6)
                .status(Reservation.Status.pending).note("Birthday party").build(),
            Reservation.builder().user(john).table(tables.get(0))
                .date(LocalDate.now().plusDays(2)).time("13:00").guests(2)
                .status(Reservation.Status.confirmed).note("").build()
        ));
    }
}
