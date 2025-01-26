package com.capx.holdsmart.controller;

import com.capx.holdsmart.model.Stock;
import com.capx.holdsmart.model.User;
import com.capx.holdsmart.service.StockService;
import com.capx.holdsmart.repository.UserRepo;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/stocks")
public class StockController {
    @Autowired
    private StockService stockService;

    @Autowired
    private UserRepo userRepo;
    

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }
    @PostMapping("/addStock")
    public ResponseEntity<?> addStock(@RequestBody Stock stock, Principal principal) {
        try {
            User user = userRepo.findByEmail(principal.getName());
            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }
            stock.setUser(null);
            stock.setUser(user);
            ResponseEntity<Stock> response = stockService.saveStock(stock);
            return response;
    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
      

    @GetMapping("/getStock/{id}")
    public ResponseEntity<Stock> getStock(@PathVariable Long id) {
        return stockService.getStock(id);
    }

    @GetMapping("/getStocksByUser/{userId}")
    public ResponseEntity<List<Stock>> getStocksByUser(@PathVariable Long userId) {
        return stockService.getStocksByUser(userId);
    }


    @GetMapping("/getAllStocks")
    public ResponseEntity<List<Stock>> getAllStocks() {
        return stockService.getAllStocks();
    }

    @DeleteMapping("/deleteStock/{id}")
    public ResponseEntity<String> deleteStock(@PathVariable Long id) {
        return stockService.deleteStock(id);
    }

    @DeleteMapping("/deleteAllStocks/{userId}")
    public ResponseEntity<String> deleteAllStocks(@PathVariable Long userId) {
        return stockService.deleteAllStocks(userId);
    }

    @PutMapping("/updateStock/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long id, @RequestBody Stock stock) {
        return stockService.updateStock(id, stock);
    }
}
