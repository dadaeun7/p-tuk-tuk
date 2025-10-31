package com.server.back.util;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class KeywordSplitUtil {

    /**
     * @param keyword (예: 샴푸/린스/트리트먼트, 소스/장류 등)
     * @return [샴푸, 린스, 트리트먼트], [소스, 장류]
     */
    public static List<String> splitKeywords(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        String[] splitKeywords = keyword.split("/");

        return Arrays.stream(splitKeywords)
                .map(KeywordSplitUtil::cleanString)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public static String cleanString(String in) {
        if (in == null) {
            return "";
        }

        return in.trim().replaceAll("[\\s\\p{Punct}]", "");
    }

}