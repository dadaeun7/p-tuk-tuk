package com.server.back.infrastructure.parser;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.server.back.domain.order.dto.ProductToQuantityParser;

@Component
public class QuantityParser {

    private static final Pattern BUNDLE_PATEERN = Pattern.compile("[(\\[(](\\d+)(?:개|입|매|롤|묶음|팩)[^)\\]]*[)\\]]");
    private static final Pattern MULTIPLIER_PATTERN = Pattern.compile("[x*×]\\s*(\\d+)");

    public ProductToQuantityParser parser(String subText, int copyQuantity) {
        String tempText = subText;
        int tempQuantity = copyQuantity;

        Matcher bundleMatch = BUNDLE_PATEERN.matcher(tempText);

        while (bundleMatch.find()) {
            String numberMatch = bundleMatch.group(1);
            tempQuantity *= Integer.parseInt(numberMatch);
        }

        Matcher multiplierMatch = MULTIPLIER_PATTERN.matcher(tempText);
        while (multiplierMatch.find()) {
            String numberMatch = multiplierMatch.group(1);
            tempQuantity *= Integer.parseInt(numberMatch);
        }

        return new ProductToQuantityParser(tempText, tempQuantity);
    }
}
