package com.ESDMicroservices.ordermicroservice.model;

import java.math.BigDecimal;

import org.hibernate.annotations.ForeignKey;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Order {
    @Id
    private String OrderId; // sadadsa
    private String CustomerId; // dsadsadsa
    private String OrderDetails; // {burger: 1, coke: 1,} //{name,qty}
    private String ModeOfEating; // Onsite
    private String InvoiceId; // abc //foreign key to invoice table

}

// invoice databse
// private String InvoiceId
// private String OrderId
// private BigDecimal TotalPrice;
// private String PaymentStatus;
// private String Sessionid;
// private String PaymentintentId;
// private String RefundId;
// private String RefundStatus;