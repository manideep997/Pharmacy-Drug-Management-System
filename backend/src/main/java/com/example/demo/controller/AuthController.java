package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Seller;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.SellerRepository;
import com.example.demo.security.CustomUserDetailsService;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Static classes for Request/Response mapping
    public static class AuthRequest {
        public String username;
        public String password;
        public String type; // "customer" or "seller"
    }

    public static class AuthResponse {
        public String jwt;
        public String type;

        public AuthResponse(String jwt, String type) {
            this.jwt = jwt;
            this.type = type;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.username, authRequest.password)
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Incorrect username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.username);
        
        // Determine role for token
        String role = "CUSTOMER";
        if (sellerRepository.findBySid(authRequest.username).isPresent()) {
            role = "SELLER";
        }

        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), role);

        return ResponseEntity.ok(new AuthResponse(jwt, role.toLowerCase()));
    }

    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer customer) {
        if (customerRepository.findByUid(customer.getUid()).isPresent()) {
            return ResponseEntity.badRequest().body("Customer ID already exists");
        }
        // Hash password before saving
        customer.setPass(passwordEncoder.encode(customer.getPass()));
        customerRepository.save(customer);
        return ResponseEntity.ok("Customer registered successfully");
    }

    @PostMapping("/register/seller")
    public ResponseEntity<?> registerSeller(@RequestBody Seller seller) {
        if (sellerRepository.findBySid(seller.getSid()).isPresent()) {
            return ResponseEntity.badRequest().body("Seller ID already exists");
        }
        seller.setPass(passwordEncoder.encode(seller.getPass()));
        sellerRepository.save(seller);
        return ResponseEntity.ok("Seller registered successfully");
    }
}
