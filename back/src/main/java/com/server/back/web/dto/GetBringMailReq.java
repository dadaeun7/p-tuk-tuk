package com.server.back.web.dto;

import java.time.LocalDate;

public record GetBringMailReq(LocalDate start, LocalDate end) {
}