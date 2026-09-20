package com.lamaison.controller;

import com.lamaison.dto.ReservationDto;
import com.lamaison.entity.User;
import com.lamaison.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // Admin: get all reservations
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDto.Response>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    // Customer: get own reservations
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDto.Response>> getMine(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reservationService.getMyReservations(user.getId()));
    }

    // Create reservation (any authenticated user)
    @PostMapping
    public ResponseEntity<ReservationDto.Response> create(
        @Valid @RequestBody ReservationDto.CreateRequest req,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(reservationService.create(req, user));
    }

    // Update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<ReservationDto.Response> updateStatus(
        @PathVariable Long id,
        @RequestBody ReservationDto.StatusUpdate body,
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(reservationService.updateStatus(id, body.getStatus(), user));
    }
}
