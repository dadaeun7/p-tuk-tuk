package com.server.back.web.controller;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.domain.order.dto.SendOrderDto;
import com.server.back.domain.order.service.OrderService;
import com.server.back.infrastructure.security.TukUserDetails;
import com.server.back.web.dto.ModifyDisposalReq;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/bring/order")
    public ResponseEntity<List<SendOrderDto>> bringOrder(@AuthenticationPrincipal TukUserDetails userDetails) {

        Long userId = userDetails.getId();

        List<SendOrderDto> sendOrders = orderService.bringOrderList(userId);
        return ResponseEntity.ok(sendOrders);
    }

    @PostMapping("/delete/order")
    public ResponseEntity<?> deleteOrder(@RequestBody List<String> itemNumbers,
            @AuthenticationPrincipal TukUserDetails userDetails) {

        boolean check = orderService.deleteOrder(itemNumbers);

        if (check) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }

    }

    @PostMapping("/check/disposal")
    public ResponseEntity<?> modifyDisposal(@RequestBody ModifyDisposalReq req) {

        ZonedDateTime res = orderService.checkDisposal(req.orderNumberList(), req.isCheck());

        Map<String, ZonedDateTime> body = Collections.singletonMap("disposalDate", res);

        return ResponseEntity.ok(body);
    }
}
