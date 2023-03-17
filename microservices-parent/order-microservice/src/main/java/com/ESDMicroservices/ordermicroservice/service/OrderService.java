package com.ESDMicroservices.ordermicroservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.ESDMicroservices.ordermicroservice.dto.OrderLineItemsDto;
import com.ESDMicroservices.ordermicroservice.dto.OrderRequest;

import com.ESDMicroservices.ordermicroservice.model.Order;
import com.ESDMicroservices.ordermicroservice.model.OrderLineItems;
import com.ESDMicroservices.ordermicroservice.repository.OrderRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void placeOrder(OrderRequest orderRequest, String customerId, String Mode) {
        Order order = new Order();
        order.setCustomerId(customerId);
        order.setModeOfEating(Mode);

        List<OrderLineItems> orderLineItems = orderRequest.getOrderLineItemsDtoList()
                .stream()
                .map(this::mapToDto)
                .toList();
        order.setOrderLineItemsList(orderLineItems);
        order.setInvoiceId("None");
        order.setStatus("Preorder");
        orderRepository.save(order);
    }

    private OrderLineItems mapToDto(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItems.setProduct_name(orderLineItemsDto.getProduct_name());
        return orderLineItems;
    }

    public List<Order> searchOrders() {
        List<Order> order = orderRepository.findOrdersWithDetails();
        return order;
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findOrderById(orderId);
    }
}
