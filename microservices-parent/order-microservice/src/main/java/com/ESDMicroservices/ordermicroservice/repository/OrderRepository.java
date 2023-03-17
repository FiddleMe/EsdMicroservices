package com.ESDMicroservices.ordermicroservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ESDMicroservices.ordermicroservice.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query(value = "SELECT t1.order_id, t1.customer_id, t1.invoice_id, t1.mode_of_eating, " +
            "(SELECT JSON_ARRAYAGG(JSON_OBJECT('id', t3.id, 'product_name', t3.product_name, 'quantity', t3.quantity)) "
            +
            "FROM t_orders_order_line_items_list t2 JOIN t_order_line_items t3 ON t2.order_line_items_list_id = t3.id "
            +
            "WHERE t2.order_order_id = t1.order_id) AS order_details " +
            "FROM t_orders t1", nativeQuery = true)
    List<Order> findOrdersWithDetails();

    @Query(nativeQuery = true, value = "SELECT t1.order_id, t1.customer_id, t1.invoice_id, t1.mode_of_eating, JSON_OBJECTAGG( t3.id, JSON_OBJECT('product_name', t3.product_name, 'quantity', t3.quantity) ) as order_line_items FROM t_orders t1 LEFT JOIN t_orders_order_line_items_list t2 ON t1.order_id = t2.order_order_id LEFT JOIN t_order_line_items t3 ON t2.order_line_items_list_id = t3.id WHERE t1.order_id = ?1 GROUP BY t1.order_id, t1.customer_id, t1.invoice_id, t1.mode_of_eating;")
    Optional<Order> findOrderById(Long orderId);
}
