package com.lamaison.service;

import com.lamaison.dto.ReservationDto;
import com.lamaison.entity.Reservation;
import com.lamaison.entity.RestaurantTable;
import com.lamaison.entity.User;
import com.lamaison.repository.ReservationRepository;
import com.lamaison.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository resRepo;
    private final TableRepository tableRepo;

    public List<ReservationDto.Response> getAll() {
        return resRepo.findByOrderByDateAscTimeAsc()
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ReservationDto.Response> getMyReservations(Long userId) {
        return resRepo.findByUserId(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public ReservationDto.Response create(ReservationDto.CreateRequest req, User user) {
        RestaurantTable table = tableRepo.findById(req.getTableId())
            .orElseThrow(() -> new RuntimeException("Table not found"));

        // Check capacity
        if (table.getCapacity() < req.getGuests()) {
            throw new RuntimeException("Table capacity exceeded");
        }

        // Check availability
        List<Reservation> conflicts = resRepo.findConflicting(table, req.getDate(), req.getTime());
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Table is already reserved for this time");
        }

        Reservation res = resRepo.save(Reservation.builder()
            .user(user)
            .table(table)
            .date(req.getDate())
            .time(req.getTime())
            .guests(req.getGuests())
            .status(Reservation.Status.pending)
            .note(req.getNote())
            .build());

        return toDto(res);
    }

    public ReservationDto.Response updateStatus(Long id, String status, User currentUser) {
        Reservation res = resRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Only admin can confirm; user or admin can cancel
        if ("confirmed".equals(status) && currentUser.getRole() != User.Role.admin) {
            throw new RuntimeException("Only admins can confirm reservations");
        }

        if ("cancelled".equals(status)) {
            if (currentUser.getRole() != User.Role.admin && !res.getUser().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Not authorized");
            }
        }

        res.setStatus(Reservation.Status.valueOf(status));
        return toDto(resRepo.save(res));
    }

    private ReservationDto.Response toDto(Reservation r) {
        ReservationDto.Response dto = new ReservationDto.Response();
        dto.setId(r.getId());
        dto.setUserId(r.getUser().getId());
        dto.setUserName(r.getUser().getName());
        dto.setTableId(r.getTable().getId());
        dto.setTableNumber(r.getTable().getNumber());
        dto.setTableZone(r.getTable().getZone());
        dto.setDate(r.getDate().toString());
        dto.setTime(r.getTime());
        dto.setGuests(r.getGuests());
        dto.setStatus(r.getStatus().name());
        dto.setNote(r.getNote());
        return dto;
    }
}
