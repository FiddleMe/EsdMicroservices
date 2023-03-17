package com.ESDMicroservices.ordermicroservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ESDMicroservices.ordermicroservice.dto.OrderRequest;

import com.ESDMicroservices.ordermicroservice.model.Order;
import com.ESDMicroservices.ordermicroservice.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        orderService.placeOrder(orderRequest, "testing", "hi");
        return "Order placed successfully";
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Order> searchOrders() {
        return orderService.searchOrders();
    }

    @GetMapping("/findOrderById")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Order> getOrderById(@RequestParam("OrderId") Long orderId) {
        Optional<Order> optionalOrder = orderService.getOrderById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            return ResponseEntity.ok().body(order); // Return 200 with Order object
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Return 400 with no body
        }
    }
}
