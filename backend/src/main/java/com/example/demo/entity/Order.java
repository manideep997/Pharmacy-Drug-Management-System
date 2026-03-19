package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long oid;

    private String pid;
    private String sid;
    private String uid;

    @Column(name="orderdatetime")
    private Date orderdatetime;

    private Integer quantity;
    private Integer price;
}
