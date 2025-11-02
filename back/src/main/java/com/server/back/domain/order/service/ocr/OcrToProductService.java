package com.server.back.domain.order.service.ocr;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OcrToProductService {

    // 3,790 또는 100,900, 1,000원 등 ...
    private static final String PRICE_AND_UNIT_LINE_REGEX = "^\\s*[\\d,.]+\\s*(?:kg|g|ml|L|개|EA|입|원|₩)?\\s*$";
    private static final Pattern PRICE_AND_UNIT_LINE_PATTERN = Pattern.compile(PRICE_AND_UNIT_LINE_REGEX);

    // 배민 장보기 상품명 중 (예) 8801117765903
    private static final String LON_NUMBER_REGEX = "\\s*\\d{6,14}\\s*";
    private static final Pattern LON_NUMBER_PATTERN = Pattern.compile(LON_NUMBER_REGEX);

    private static final String BRACKETS_REGEX_PATTERN_TO_REMOVE = "\\[(?!배민이지).*?\\]\\s*";
    private static final Pattern BRACKETS_REGEX_PATTERN = Pattern.compile(BRACKETS_REGEX_PATTERN_TO_REMOVE);

    public List<String> extractProductName(List<String> extractOcrList) {

        List<String> newProductList = noneProductName(extractOcrList).stream()
                .map(productName -> removeLongNumbers(productName))
                .collect(Collectors.toList());

        if (newProductList.isEmpty()) {
            return List.of();
        }

        List<String> finalProductList = new ArrayList<>();
        List<String> processedNames = new ArrayList<>();

        log.info("newProductList.size() :" + newProductList.size());

        for (int i = 0; i < newProductList.size(); i++) {

            String fLowName = newProductList.get(i).trim();
            String fName = newProductList.get(i).replaceAll(" ", "").trim();

            if (processedNames.contains(fName)) {
                continue;
            }

            if (i + 1 < newProductList.size()) {

                String sLowName = removeLongNumbers(newProductList.get(i + 1).trim());
                String sName = removeLongNumbers(newProductList.get(i + 1)).replaceAll(" ", "").trim();

                if (fName.contains(sName) || sName.contains(fName)) {

                    String s1 = fName.length() > sName.length() ? fName : sName;
                    String s2 = fName.length() < sName.length() ? fName : sName;

                    String f1 = fName.length() > sName.length() ? fLowName : sLowName;
                    String f2 = fName.length() < sName.length() ? fLowName : sLowName;

                    String combined = findOverlapCombine(s1, s2);

                    if (processedNames.add(combined)) {
                        finalProductList.add(oneProductName(f1 + f2));
                    }

                    i++;
                    continue;
                }
            }

            if (processedNames.add(fName)) {
                finalProductList.add(oneProductName(fLowName));
            }
        }
        return finalProductList;

    }

    private List<String> noneProductName(List<String> line) {

        return line.stream()
                .map(String::trim)
                .filter(item -> item.length() > 3 || !item.matches("^[\\d,./]+$"))
                .filter(item -> !PRICE_AND_UNIT_LINE_PATTERN.matcher(item).matches())
                .map(item -> removeBrackets(item))
                .collect(Collectors.toList());
    }

    public static String removeLongNumbers(String line) {
        return LON_NUMBER_PATTERN.matcher(line).replaceAll("").trim();
    }

    public static String removeBrackets(String line) {
        return BRACKETS_REGEX_PATTERN.matcher(line).replaceAll("").trim();
    }

    private String findOverlapCombine(String s1, String s2) {

        String checkString = s1 + s2;
        return checkString;
    }

    public static String oneProductName(String fullProduct) {
        if (fullProduct == null || fullProduct.length() < 2) {
            return fullProduct;
        }

        int length = fullProduct.length();

        for (int i = length / 2; i > 0; i--) {
            String prefix = fullProduct.substring(0, i);

            int foundIndex = fullProduct.indexOf(prefix, i);

            if (foundIndex != -1) {
                return fullProduct.substring(0, foundIndex).trim();
            }
        }

        return fullProduct;
    }

}
