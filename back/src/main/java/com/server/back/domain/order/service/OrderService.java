package com.server.back.domain.order.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.domain.email.entity.ProcessedEmail;
import com.server.back.domain.ocr.entity.ProcessedOcr;
import com.server.back.domain.order.dto.SendMaterialDto;
import com.server.back.domain.order.dto.SendOrderDto;
import com.server.back.domain.order.dto.SendOrderItemDto;
import com.server.back.domain.order.entity.MatchItemComposition;
import com.server.back.domain.order.entity.RecycleMatchItem;
import com.server.back.domain.order.entity.RecycleMatchResult;
import com.server.back.domain.order.entity.RecycleOrder;
import com.server.back.domain.order.entity.RecycleOrderItem;
import com.server.back.domain.order.entity.RecycleOrder.Vendor;
import com.server.back.infrastructure.jpa.email.repository.ProcessedEmailRepository;
import com.server.back.infrastructure.jpa.ocr.repository.ProcessedOcrRepository;
import com.server.back.infrastructure.jpa.order.repository.MatchItemCompositionRepository;
import com.server.back.infrastructure.jpa.order.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final MatchItemCompositionRepository matchItemCompositionRepository;
        private final ProcessedEmailRepository processedEmailRepository;
        private final ProcessedOcrRepository processedOcrRepository;

        private List<SendOrderItemDto> getToOrderItemDto(RecycleOrder order,
                        Map<Long, List<SendMaterialDto>> matchedMaterialDto) {

                RecycleMatchResult recycleMatchResult = order.getRecycleResult();

                List<RecycleOrderItem> orderItems = order.getOrderItems();
                List<RecycleMatchItem> matchItems = recycleMatchResult.getRecycleMatchItems();

                int matchItemCount = matchItems.size();

                List<SendOrderItemDto> itemDtos = IntStream.range(0, matchItemCount)
                                .mapToObj(i -> {
                                        RecycleOrderItem orderItem = orderItems.get(i);
                                        RecycleMatchItem matchItem = matchItems.get(i);
                                        Long rmiId = matchItem.getId();

                                        List<SendMaterialDto> materialDtos = matchedMaterialDto.getOrDefault(rmiId,
                                                        Collections.emptyList());

                                        return SendOrderItemDto.builder()
                                                        .product(orderItem.getProudct())
                                                        .description(matchItem.getMatchDescription())
                                                        .materials(materialDtos).build();

                                }).collect(Collectors.toList());

                return itemDtos;

        }

        /* dto 변환 메서드 */
        /* dto 변환 메서드 */

        @Transactional(readOnly = true)
        public List<SendOrderDto> bringOrderList(Long userId) {

                List<RecycleOrder> orders = orderRepository.findFullDetailByUserId(userId);

                if (orders.isEmpty()) {
                        return Collections.emptyList();
                }

                List<Long> allMatchItem = orders.stream()
                                .flatMap(o -> o.getRecycleResult().getRecycleMatchItems().stream())
                                .map(RecycleMatchItem::getId).collect(Collectors.toList());

                List<MatchItemComposition> compositions = allMatchItem.isEmpty() ? Collections.emptyList()
                                : matchItemCompositionRepository.findWithMaterialsByRecycleMatchItemIds(allMatchItem);

                Map<Long, List<SendMaterialDto>> matchItemMaterialMap = createMaterialMap(compositions);

                return orders.stream()
                                .map(o -> {
                                        return SendOrderDto.builder()
                                                        .orderNumber(o.getOrderNumber())
                                                        .vendor(o.getVendor().toString())
                                                        .orderDate(o.getOrderDate())
                                                        .orderitems(getToOrderItemDto(o, matchItemMaterialMap))
                                                        .disposalDate(o.getRecycleResult().getDisposal())
                                                        .build();
                                }).collect(Collectors.toList());
        }

        private Map<Long, List<SendMaterialDto>> createMaterialMap(List<MatchItemComposition> compositions) {

                Map<Long, List<MatchItemComposition>> groupMap = compositions.stream().collect(Collectors.groupingBy(
                                mic -> mic.getRecycleMatchItem().getId()));

                return groupMap.entrySet().stream()
                                .collect(Collectors.toMap(
                                                (Function<Map.Entry<Long, List<MatchItemComposition>>, Long>) Map.Entry::getKey,
                                                (Function<Map.Entry<Long, List<MatchItemComposition>>, List<SendMaterialDto>>) entry -> entry
                                                                .getValue().stream()
                                                                .flatMap(mic -> mic.getMaterials().stream())
                                                                .map(m -> new SendMaterialDto(
                                                                                m.getName(),
                                                                                m.getDisplay()))
                                                                .collect(Collectors.toList())));

        }

        @Transactional
        public boolean deleteOrder(List<String> deleteList) {

                try {
                        List<RecycleOrder> lists = orderRepository.findByOrderNumberIn(deleteList);

                        for (RecycleOrder recycleOrder : lists) {

                                if (recycleOrder.getVendor() != Vendor.OCR) {

                                        ProcessedEmail deleteEmail = processedEmailRepository
                                                        .findByOrderDate(recycleOrder.getOrderDate());

                                        deleteEmail.getProductList().clear();
                                        processedEmailRepository.delete(deleteEmail);

                                } else {

                                        ProcessedOcr deleteOcr = processedOcrRepository
                                                        .findByCreateDate(recycleOrder.getOrderDate());

                                        deleteOcr.getOcrProductList().clear();
                                        processedOcrRepository.delete(deleteOcr);
                                }

                                recycleOrder.getRecycleResult().getRecycleMatchItems().forEach(rmi -> {
                                        rmi.getCompositions().forEach(cp -> {
                                                cp.getMaterials().clear();
                                        });
                                });

                                recycleOrder.getRecycleResult().getRecycleMatchItems().forEach(rmi -> {
                                        rmi.getCompositions().clear();
                                });

                                recycleOrder.getRecycleResult().getRecycleMatchItems().clear();

                                recycleOrder.getOrderItems().clear();

                                recycleOrder.setRecycleResultToNull();

                                orderRepository.delete(recycleOrder);
                        }

                        return true;

                } catch (Exception e) {
                        log.error("주문건 삭제 중 에러 발생" + e.getMessage());
                        return false;
                }

        }

        @Transactional
        public ZonedDateTime checkDisposal(List<String> orderNumber, boolean isCheck) {

                List<RecycleOrder> order = orderRepository.findByOrderNumberIn(orderNumber);

                ZonedDateTime submit = null;

                if (isCheck) {
                        submit = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
                }

                for (RecycleOrder recycleOrder : order) {
                        recycleOrder.getRecycleResult().setDisposal(submit);
                }

                return submit;
        }
}
