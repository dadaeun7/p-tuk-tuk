package com.server.back.domain.order.service.transactional;

import java.util.List;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.back.domain.email.entity.EmailProduct;
import com.server.back.domain.email.entity.ProcessedEmail;
import com.server.back.domain.ocr.entity.OcrProduct;
import com.server.back.domain.ocr.entity.ProcessedOcr;
import com.server.back.domain.order.entity.RecycleOrder;
import com.server.back.domain.order.entity.RecycleOrderItem;
import com.server.back.infrastructure.jpa.order.repository.OrderRepository;
import com.server.back.util.OrderUniqueNumberGenerator;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RecycleOrderSave {

    private final OrderRepository orderRepository;

    @Retryable(value = ObjectOptimisticLockingFailureException.class, maxAttempts = 3, backoff = @Backoff(delay = 500))
    @Transactional
    public RecycleOrder saveRecycleOrder(ProcessedEmail email, List<EmailProduct> products) {

        RecycleOrder order = RecycleOrder.create();
        order.initSet(
                email.getRecipientUser(),
                OrderUniqueNumberGenerator.geratorOrderNumber(),
                email.getSendor(),
                email.getOrderDate());

        for (EmailProduct product : products) {
            /**
             * RecycleOrderItem Save 및 RecycleOrder 설정완료
             */
            RecycleOrderItem orderItem = RecycleOrderItem.create();
            orderItem.setProductAndQunatity(product.getProductName(), product.getQuantity());
            order.setOrderItems(orderItem);
        }

        RecycleOrder saveOrder = orderRepository.save(order);

        return saveOrder;
    }

    @Retryable(value = ObjectOptimisticLockingFailureException.class, maxAttempts = 3, backoff = @Backoff(delay = 500))
    @Transactional
    public RecycleOrder saveRecycleOrderOcr(ProcessedOcr ocr, List<OcrProduct> products) {

        RecycleOrder order = RecycleOrder.create();
        order.initSet(ocr.getByUser(),
                OrderUniqueNumberGenerator.geratorOrderNumber(),
                "OCR",
                ocr.getCreateDate());

        for (OcrProduct product : products) {
            RecycleOrderItem orderItem = RecycleOrderItem.create();
            orderItem.setProductAndQunatity(product.getProductName(), 1);
            order.setOrderItems(orderItem);
        }

        RecycleOrder saveOrder = orderRepository.save(order);
        return saveOrder;
    }
}
