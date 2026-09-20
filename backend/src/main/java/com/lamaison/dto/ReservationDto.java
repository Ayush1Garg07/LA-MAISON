package com.lamaison.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

public class ReservationDto {

    @Data
    public static class CreateRequest {
        @NotNull
        private Long tableId;
        @NotNull
        private LocalDate date;
        @NotBlank
        private String time;
        @Min(1)
        private int guests;
        private String note;
    }

    @Data
    public static class Response {
        private Long id;
        private Long userId;
        private String userName;
        private Long tableId;
        private String tableNumber;
        private String tableZone;
        private String date;
        private String time;
        private int guests;
        private String status;
        private String note;
    }

    @Data
    public static class StatusUpdate {
        @NotBlank
        private String status;
    }
}
