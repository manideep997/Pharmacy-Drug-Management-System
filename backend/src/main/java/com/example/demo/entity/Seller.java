package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seller")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seller {

    @Id
    private String sid;

    private String sname;
    private String pass;
    private String address;
    private Long phno;
}
