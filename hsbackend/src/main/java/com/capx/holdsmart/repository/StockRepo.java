package com.capx.holdsmart.repository;

import com.capx.holdsmart.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepo extends JpaRepository<Stock, Long> {
    Optional<Stock> findBySymbolAndUserId(String symbol, Long userId);
    List<Stock> findByUserId(Long userId);
    @Transactional
    void deleteAllByUserId(Long userId);
}

