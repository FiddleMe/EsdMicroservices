package com.ESDMicroservices.ordermicroservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;

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
    public Optional<Order> getOrderById(@RequestParam("OrderId") Long orderId) {
        return orderService.getOrderById(orderId);
    }

    // @GetMapping
    // @ResponseStatus(HttpStatus.OK)
    // public ResponseEntity<List<OrderDTO>> getOrders() {
    // List<OrderDTO> orders = orderService.getOrders();
    // return new ResponseEntity<>(orders, HttpStatus.OK);
    // }
}
