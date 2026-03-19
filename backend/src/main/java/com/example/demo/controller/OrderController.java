package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/customer")
    public ResponseEntity<List<Order>> getCustomerOrders(Authentication authentication) {
        String uid = authentication.getName(); // Extracted from JWT
        return ResponseEntity.ok(orderRepository.findByUid(uid));
    }

    @GetMapping("/seller")
    public ResponseEntity<List<Order>> getSellerOrders(Authentication authentication) {
        String sid = authentication.getName(); // Extracted from JWT
        return ResponseEntity.ok(orderRepository.findBySid(sid));
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order, Authentication authentication) {
        String uid = authentication.getName();
        order.setUid(uid);
        order.setOrderdatetime(new Date());
        // In a real scenario, we'd also check inventory and decrement it here
        orderRepository.save(order);
        return ResponseEntity.ok("Order placed successfully");
    }
}
