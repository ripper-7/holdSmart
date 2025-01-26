package com.capx.holdsmart.service;

import com.capx.holdsmart.model.Stock;
import com.capx.holdsmart.repository.StockRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepo stockRepo;

    public StockServiceImpl(StockRepo stockRepo) {
        this.stockRepo = stockRepo;
    }
    
    public ResponseEntity<Stock> saveStock(Stock stock) {
        try {
            Optional<Stock> existingStock = stockRepo.findBySymbolAndUserId(stock.getSymbol(), stock.getUser().getId());

            if (existingStock.isPresent()) {
                Stock stockToUpdate = existingStock.get();
                stockToUpdate.setQuantity(stockToUpdate.getQuantity() + stock.getQuantity());
                stockToUpdate.setPurchasePrice((stockToUpdate.getPurchasePrice() + stock.getPurchasePrice()) / 2); 
                Stock updatedStock = stockRepo.save(stockToUpdate);
                return ResponseEntity.ok(updatedStock);
            }

            Stock savedStock = stockRepo.save(stock);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedStock);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Override
    public ResponseEntity<Stock> getStock(Long id) {
        try{
            return ResponseEntity.ok(stockRepo.findById(id).orElse(null));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @Override
    public ResponseEntity<List<Stock>> getStocksByUser(Long userId) {
        try{
            return ResponseEntity.ok(stockRepo.findByUserId(userId));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @Override
    public ResponseEntity<List<Stock>> getAllStocks() {
        try{
            return ResponseEntity.ok(stockRepo.findAll());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @Override
    public ResponseEntity<String> deleteStock(Long id) {
        try{
            stockRepo.deleteById(id);
            return ResponseEntity.ok("Stock deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Stock not found");
    }

    @Override
    public ResponseEntity<String> deleteAllStocks(Long userId) {
        try{
            stockRepo.deleteAllByUserId(userId);
            return ResponseEntity.ok("All stocks deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Stocks not found");
    }

    @Override
    public ResponseEntity<Stock> updateStock(Long id, Stock stock) {
        try {
            Optional<Stock> existingStockOptional = stockRepo.findById(id);
            if (existingStockOptional.isPresent()) {
                Stock existingStock = existingStockOptional.get();
    
                if (stock.getUser() != null) {
                    existingStock.setUser(stock.getUser());  
                }
    
                if (stock.getQuantity() != 0) {
                    existingStock.setQuantity(stock.getQuantity());
                }
                if (stock.getPurchasePrice() != 0) {
                    existingStock.setPurchasePrice(stock.getPurchasePrice());
                }
    
                Stock updatedStock = stockRepo.save(existingStock);
                return ResponseEntity.ok(updatedStock);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); 
        }
    }
    
}