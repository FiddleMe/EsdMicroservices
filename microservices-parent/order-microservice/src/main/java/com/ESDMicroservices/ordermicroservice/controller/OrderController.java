package com.ESDMicroservices.ordermicroservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public ResponseEntity<String> placeOrder(@RequestBody OrderRequest orderRequest, @RequestParam String customerId,
            @RequestParam String Mode) {
        orderService.placeOrder(orderRequest, customerId, Mode);
        String message = "Order placed successfully";
        return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\":\"" + message + "\"}");
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

    @PutMapping("/updateOrderById")
    public ResponseEntity<String> updateOrderById(@RequestParam("OrderId") Long orderId,
            @RequestParam(value = "InvoiceId", required = false) String invoiceId,
            @RequestParam(value = "Status", required = false) String status) {
        Optional<Order> optionalOrder = orderService.getOrderById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            // Update invoice_id if provided in the request body
            if (invoiceId != null) {
                order.setInvoiceId(invoiceId);
            }
            if (status != null) {
                order.setStatus(status);
            }

            orderService.saveOrder(order);
            return ResponseEntity.ok().body("Order with ID " + orderId + " updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order with ID " + orderId + " not found.");
        }
    }
}
