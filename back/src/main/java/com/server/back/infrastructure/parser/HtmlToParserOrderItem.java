package com.server.back.infrastructure.parser;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import com.server.back.domain.order.dto.ParserToOrderItemDto;
import com.server.back.domain.order.dto.ProductToQuantityParser;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class HtmlToParserOrderItem {

    private final QuantityParser quntityParser;

    public List<ParserToOrderItemDto> parserBaemin(String html) {

        List<ParserToOrderItemDto> result = new ArrayList<>();
        Document doc = Jsoup.parse(html);

        Element orderDiv = doc.select("div:contains(주문상품 정보)").first();
        Element orderTable = orderDiv.selectFirst("table");
        Elements rows = orderTable.select("tbody tr");

        for (Element row : rows) {
            Elements cols = row.select("td");
            if (cols.size() >= 3) {

                ProductToQuantityParser insert = quntityParser.parser(cols.get(0).text(),
                        Integer.parseInt(cols.get(1).text()));

                ParserToOrderItemDto ptod = ParserToOrderItemDto.builder()
                        .itemName(insert.cleanName())
                        .quantity(insert.totalQuntity())
                        .build();

                result.add(ptod);
            }
        }

        return result;
    }

    public List<ParserToOrderItemDto> parserCoupang(String html) {

        List<ParserToOrderItemDto> result = new ArrayList<>();
        Document doc = Jsoup.parse(html);

        Elements tables = doc.select("table.vendor-item-table");

        for (Element table : tables) {
            Elements names = table.select("td[colspan=6][style*=font]");
            String itemName = names.isEmpty() ? "" : names.first().text();

            Elements rows = table.select("tr");
            for (Element row : rows) {
                Elements cols = row.select("td");
                if (cols.size() >= 5 && row.text().contains("구매금액") == false) {

                    ProductToQuantityParser insert = quntityParser.parser(itemName,
                            Integer.parseInt(cols.get(3).text()));

                    ParserToOrderItemDto ptod = ParserToOrderItemDto.builder()
                            .itemName(insert.cleanName())
                            .quantity(insert.totalQuntity())
                            .build();
                    result.add(ptod);
                }
            }
        }
        return result;
    }

    public List<ParserToOrderItemDto> parserKerly(String html) {
        List<ParserToOrderItemDto> result = new ArrayList<>();
        Document doc = Jsoup.parse(html);

        Elements rows = doc.select("table tbody tr");

        for (Element row : rows) {
            Elements cols = row.select("td");

            if (cols.size() >= 5 && !(row.text().contains("총 결제금액"))) {

                ProductToQuantityParser insert = quntityParser.parser(cols.get(1).text(),
                        Integer.parseInt(cols.get(3).text()));

                ParserToOrderItemDto ptod = ParserToOrderItemDto.builder()
                        .itemName(insert.cleanName())
                        .quantity(insert.totalQuntity())
                        .build();
                result.add(ptod);
            }
        }

        return result;
    }

}
