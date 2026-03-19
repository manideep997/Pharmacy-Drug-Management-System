package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // Only sellers can add products
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        if (productRepository.findByPname(product.getPname()).isPresent()) {
            return ResponseEntity.badRequest().body("Product with this name already exists");
        }
        productRepository.save(product);
        return ResponseEntity.ok("Product added successfully");
    }
}
