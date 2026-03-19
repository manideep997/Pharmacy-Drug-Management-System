package com.example.demo.security;

import com.example.demo.entity.Customer;
import com.example.demo.entity.Seller;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check if user is a customer
        Optional<Customer> customer = customerRepository.findByUid(username);
        if (customer.isPresent()) {
            return User.withUsername(customer.get().getUid())
                    .password(customer.get().getPass())
                    .roles("CUSTOMER")
                    .build();
        }

        // Check if user is a seller
        Optional<Seller> seller = sellerRepository.findBySid(username);
        if (seller.isPresent()) {
            return User.withUsername(seller.get().getSid())
                    .password(seller.get().getPass())
                    .roles("SELLER")
                    .build();
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
