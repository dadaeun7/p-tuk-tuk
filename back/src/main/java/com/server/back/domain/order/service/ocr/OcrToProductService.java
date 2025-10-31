package com.server.back.domain.order.service.ocr;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class OcrToProductService {

    private static final String PRICE_AND_UNIT_LINE_REGEX = "^[\\s]*(\\d{1,3}(,\\d{3})*(\\.\\d{2})?(\\s*(?:원|개|EA|ea|g|KG|ml|L|단품))?)(\\s*\\*\\s*\\d+)?\\s*$";
    private static final Pattern PRICE_AND_UNIT_LINE_PATTERN = Pattern.compile(PRICE_AND_UNIT_LINE_REGEX);

    // 배민 장보기 상품명 중 (예) 8801117765903
    private static final String LON_NUMBER_REGEX = "\\s*\\d{5,14}\\s*";
    private static final Pattern LON_NUMBER_PATTERN = Pattern.compile(LON_NUMBER_REGEX);

    public List<String> extractProductName(List<String> extractOcrList) {

        return extractOcrList.stream()
                .filter(this::isOcrToProductLine)
                .map(this::cleanProductName)
                .map(String::trim)
                .filter(name -> !name.isEmpty() && name.length() > 1)
                .collect(Collectors.toList());
    }

    private boolean isOcrToProductLine(String line) {

        String trimLine = line.trim();

        if (PRICE_AND_UNIT_LINE_PATTERN.matcher(trimLine).matches()) {
            return false;
        }

        if (trimLine.length() < 3) {
            return false;
        }

        return true;
    }

    private String cleanProductName(String line) {
        String cleanedLine = line;

        cleanedLine = removeLongNumbers(cleanedLine);

        cleanedLine = removeFullRepetition(cleanedLine);

        return cleanedLine.trim();
    }

    private String removeLongNumbers(String line) {
        return LON_NUMBER_PATTERN.matcher(line).replaceAll("").trim();
    }

    private String removeFullRepetition(String line) {

        Pattern pattern = Pattern.compile("^(.+?)\\s*\\1$");
        Matcher matcher = pattern.matcher(line);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        return line.trim();
    }
}
