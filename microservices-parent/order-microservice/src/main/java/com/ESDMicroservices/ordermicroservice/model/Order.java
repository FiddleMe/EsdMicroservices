package com.ESDMicroservices.ordermicroservice.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "t_orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long OrderId; // sadadsa
    private String CustomerId; // dsadsadsa
    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderLineItems> orderLineItemsList; // {burger: 1, coke: 1,} //{name,qty}
    private String ModeOfEating; // Onsite
    private String InvoiceId; // abc //foreign key to invoice table
    private String Status;

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