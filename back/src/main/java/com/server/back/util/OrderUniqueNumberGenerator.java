package com.server.back.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class OrderUniqueNumberGenerator {

    private static final DateTimeFormatter UNIQUE_NUM_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyMMddHHmmss");

    public static String geratorOrderNumber() {
        String now = LocalDateTime.now().format(UNIQUE_NUM_DATE_FORMATTER);
        String uuid = UUID.randomUUID().toString()
        .replace("-", "")
        .substring(0,6)
        .toUpperCase();

        return "ORD"+now+"U"+uuid;
    }
    
}
