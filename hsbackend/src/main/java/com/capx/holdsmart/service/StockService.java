package com.capx.holdsmart.service;

import com.capx.holdsmart.model.Stock;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface StockService {
    public ResponseEntity<Stock> saveStock(Stock stock);
    public ResponseEntity<Stock> getStock(Long id);
    public ResponseEntity<List<Stock>> getStocksByUser(Long userId);
    public ResponseEntity<List<Stock>> getAllStocks();
    public ResponseEntity<String> deleteStock(Long id);
    public ResponseEntity<String> deleteAllStocks(Long userId);
    public ResponseEntity<Stock>updateStock(Long id, Stock stock);
}

