package com.server.back.util;

import java.time.LocalDate;
import java.time.ZoneId;

public final class DateTimeUtil {
    private static final ZoneId KR_ZONE = ZoneId.of("Asia/Seoul");

    private DateTimeUtil() {
    }

    public static long getStartDate(LocalDate date) {
        return date.atStartOfDay(KR_ZONE).toEpochSecond();
    }

    public static long getEndDate(LocalDate date) {
        return date.atTime(23, 59, 59).atZone(KR_ZONE).toEpochSecond();
    }
}
