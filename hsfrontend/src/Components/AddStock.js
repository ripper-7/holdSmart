import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import './Form.css';

const AddStock = () => {
  const [symbols, setSymbols] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStockSymbols = async () => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.REACT_APP_API_KEY}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSymbols(data);
      } catch (error) {
        console.error('Error fetching stock symbols:', error);
      }
    };

    fetchStockSymbols();
  }, []);

  const filteredSymbols = useMemo(() => {
    if (!searchTerm) return [];
    return symbols
      .filter(symbol => 
        symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 100); 
  }, [symbols, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSymbol || !quantity || !price) return;

    setIsLoading(true);
    const stockData = {
      symbol: selectedSymbol.symbol,
      quantity: Number(quantity),
      purchasePrice: Number(price),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/stocks/addStock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(stockData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Stock added successfully:", result);
        toast.success("Stock added successfully!");
        setSelectedSymbol(null);
        setQuantity('');
        setPrice('');
        setSearchTerm('');
        setIsDropdownOpen(false);
      } else {
        toast.error("Failed to add stock. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="container">
      <div className="formWrapper">
        <h2 className="heading">Add New Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Stock Symbol</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Search by symbol or company name"
                onFocus={() => setIsDropdownOpen(true)}
                className="input"
              />
              {isDropdownOpen && searchTerm && (
                <div className="dropdown">
                  {filteredSymbols.map((symbol) => (
                    <div
                      key={symbol.symbol}
                      className="dropdownItem"
                      onClick={() => {
                        setSelectedSymbol(symbol);
                        setSearchTerm(`${symbol.symbol} - ${symbol.description}`);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="font-medium">{symbol.symbol}</div>
                      <div className="text-sm text-gray-600">{symbol.description}</div>
                    </div>
                  ))}
                  {filteredSymbols.length === 0 && (
                    <div className="p-2 text-gray-500">No matches found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="inputGroup">
            <label>Shares</label>
            <input
              type="number"
              min="1"
              max="1000000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="input"
            />
          </div>

          <div className="inputGroup">
            <label>Cost/Share ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="input"
            />
          </div>

          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <ClipLoader color="#fff" size={20} />
              </div>
            ) : (
              'Add Stock'
            )}
          </button>
        </form>
        <p className="signupText">
          View your <a href="/portfolio" className="link">Portfolio</a>
        </p>
      </div>
    </div>
  );
};

export default AddStock;
