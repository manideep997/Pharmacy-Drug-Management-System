package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String pid;

    private String pname;
    private String manufacturer;
    private Date mfg;
    private Date exp;
    private Integer price;
}
