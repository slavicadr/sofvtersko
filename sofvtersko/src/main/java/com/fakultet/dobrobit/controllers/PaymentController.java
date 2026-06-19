package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.services.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestParam double iznos,
            @RequestParam(required = false) Long ponudaId,
            @RequestParam(required = false) String primalacEmail
    ) {
        try {
            Map<String, Object> order = paymentService.createOrder(iznos);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/capture/{orderId}")
    public ResponseEntity<Map<String, Object>> captureOrder(
            @PathVariable String orderId,
            @RequestParam double iznos,
            @RequestParam(required = false) Long ponudaId,
            @RequestParam(required = false) String primalacEmail
    ) {
        try {
            Map<String, Object> result = paymentService.captureOrder(orderId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
