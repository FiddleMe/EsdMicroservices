package com.ESDMicroservices.ordermicroservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    // public ResponseEntity<String> placeOrder(@RequestBody OrderRequest
    // orderRequest, @RequestParam String customerId,
    // @RequestParam String Mode) {
    // orderService.placeOrder(orderRequest, customerId, Mode);
    // String message = "Order placed successfully";
    // String code = "200";
    // String responseBody = String.format("{\"message\":\"%s\", \"code\":\"%s\"}",
    // message, code);
    // return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
    // }
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody OrderRequest orderRequest,
            @RequestParam String customerId,
            @RequestParam String Mode) {
        Order order = orderService.placeOrder(orderRequest, customerId, Mode);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order placed successfully");
        response.put("code", HttpStatus.CREATED.value());
        response.put("OrderId", order.getOrderId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // @GetMapping
    // @ResponseStatus(HttpStatus.OK)
    // public List<Order> searchOrders() {
    // return orderService.searchOrders();
    // }
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Map<String, Object>> searchOrders() {
        List<Order> orders = orderService.searchOrders();
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("orders", orders);
        responseMap.put("message", "Orders retrieved successfully");
        responseMap.put("code", HttpStatus.OK.value());
        return ResponseEntity.ok().body(responseMap);
    }

    // @GetMapping("/findOrderById")
    // @ResponseStatus(HttpStatus.OK)
    // public ResponseEntity<Order> getOrderById(@RequestParam("OrderId") Long
    // orderId) {
    // Optional<Order> optionalOrder = orderService.getOrderById(orderId);
    // if (optionalOrder.isPresent()) {
    // Order order = optionalOrder.get();
    // Map<String, Object> responseMap = new HashMap<>();
    // responseMap.put("message", "Order found successfully");
    // responseMap.put("order", order);
    // return ResponseEntity.ok().body(responseMap); // Return 200 with Order object
    // } else {
    // return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Return 400
    // with no body
    // }
    // }
    @GetMapping("/findOrderById")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Map<String, Object>> getOrderById(@RequestParam("OrderId") Long orderId) {
        Optional<Order> optionalOrder = orderService.getOrderById(orderId);
        Map<String, Object> responseMap = new HashMap<>();
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            responseMap.put("order", order);
            responseMap.put("message", "Order retrieved successfully");
            responseMap.put("code", HttpStatus.OK.value());
            return ResponseEntity.ok().body(responseMap); // Return 200 with Order object
        } else {
            responseMap.put("message", "Order with ID " + orderId + " not found.");
            responseMap.put("code", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap); // Return 400 with no body
        }
    }
    // @PutMapping("/updateOrderById")
    // public ResponseEntity<String> updateOrderById(@RequestParam("OrderId") Long
    // orderId,
    // @RequestParam(value = "InvoiceId", required = false) String invoiceId,
    // @RequestParam(value = "Status", required = false) String status) {
    // Optional<Order> optionalOrder = orderService.getOrderById(orderId);
    // if (optionalOrder.isPresent()) {
    // Order order = optionalOrder.get();

    // // Update invoice_id if provided in the request body
    // if (invoiceId != null) {
    // order.setInvoiceId(invoiceId);
    // }
    // if (status != null) {
    // order.setStatus(status);
    // }

    // orderService.saveOrder(order);
    // return ResponseEntity.ok().body("Order with ID " + orderId + " updated
    // successfully.");
    // } else {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order with ID " +
    // orderId + " not found.");
    // }
    // }
    // }
    @PutMapping("/updateOrderById")
    public ResponseEntity<Map<String, Object>> updateOrderById(@RequestParam("OrderId") Long orderId,
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
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order with ID " + orderId + " updated successfully.");
            response.put("code", HttpStatus.OK.value());
            return ResponseEntity.ok().body(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order with ID " + orderId + " not found.");
            response.put("code", HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}