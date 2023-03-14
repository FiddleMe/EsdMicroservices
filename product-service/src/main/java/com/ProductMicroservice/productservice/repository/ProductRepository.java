package com.ProductMicroservice.productservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.ProductMicroservice.productservice.model.Product;
public interface ProductRepository extends MongoRepository<Product, String> {
    
}
