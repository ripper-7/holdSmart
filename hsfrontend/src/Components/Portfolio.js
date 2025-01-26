import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClipLoader } from 'react-spinners';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import "./Portfolio.css";



ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Portfolio() {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const PieChartData = (stocksData) => {
    if (!stocksData || stocksData.length === 0) {
      return null;
    }

    const totalPortfolioValue = stocksData.reduce(
      (total, stock) => total + stock.currentPrice * stock.quantity,
      0
    );

    const labels = stocksData.map((stock) => stock.symbol);
    const data = stocksData.map(
      (stock) =>
        ((stock.currentPrice * stock.quantity) / totalPortfolioValue) * 100
    );

    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors.slice(0, stocksData.length),
          hoverBackgroundColor: backgroundColors.slice(0, stocksData.length),
        },
      ],
    };
  };

  const topPerformersData = (stocksData) => {
    if (!stocksData || stocksData.length === 0) {
      return null;
    }

    const labels = stocksData
      .sort((a, b) => b.percentageChange - a.percentageChange)
      .slice(0, 5)
      .map((stock) => stock.symbol);
    const data = stocksData
      .sort((a, b) => b.percentageChange - a.percentageChange)
      .slice(0, 5)
      .map((stock) => stock.percentageChange);

    return {
      labels,
      datasets: [
        {
          label: "Percentage Change (%)",
          data,
          backgroundColor: [
            "#36A2EB",
            "#FF6384",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Fetch stocks and their quotes
  useEffect(() => {
    const fetchStocks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      setLoading(true);
      try {
        const userId = getUserIdFromToken();
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/stocks/getStocksByUser/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok)
          throw new Error(`Failed to fetch stocks: ${response.status}`);

        const data = await response.json();
        const enrichedStocks = await Promise.all(
          data.map(async (stock) => {
            const quoteResponse = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${API_KEY}`
            );

            if (!quoteResponse.ok) {
              return {
                ...stock,
                currentPrice: "N/A",
                highPrice: "N/A",
                lowPrice: "N/A",
              };
            }

            const quoteData = await quoteResponse.json();
            return {
              ...stock,
              currentPrice: quoteData.c,
              highPrice: quoteData.h,
              lowPrice: quoteData.l,
              priceChange: quoteData.c - stock.purchasePrice,
              percentageChange:
                ((quoteData.c - stock.purchasePrice) / stock.purchasePrice) *
                100,
            };
          })
        );

        setStocks(enrichedStocks);
        setPieChartData(PieChartData(enrichedStocks));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [API_KEY]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const handleStockSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/stocks/updateStock/${selectedStock.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: selectedStock.quantity,
            purchasePrice: selectedStock.purchasePrice,
            user_id: userId,
          }),
        }
      );

      if (response.ok) {
        setStocks(
          stocks.map((stock) =>
            stock.id === selectedStock.id ? selectedStock : stock
          )
        );
        toast.success("Stock updated successfully");
        handleModalClose();
      } else {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    } finally { 
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    confirmAlert({
      title: "Confirm Delete All",
      message: "Are you sure you want to delete your entire portfolio?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setLoading(true);
              const token = localStorage.getItem("token");
              const userId = getUserIdFromToken();
              const response = await fetch(
                `${process.env.REACT_APP_API_URL}/stocks/deleteAllStocks/${userId}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.ok) {
                setStocks([]);
                toast.success("Portfolio deleted successfully");
              } else {
                throw new Error("Failed to delete portfolio");
              }
            } catch (error) {
              console.error("Error deleting portfolio:", error);
              toast.error("Failed to delete portfolio");
            } finally {
              setLoading(false);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleDelete = async (stockId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this stock?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setLoading(true);
              const token = localStorage.getItem("token");
              const response = await fetch(
                `${process.env.REACT_APP_API_URL}/stocks/deleteStock/${stockId}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.ok) {
                setStocks(stocks.filter((stock) => stock.id !== stockId));
                toast.success("Stock deleted successfully");
              } else {
                throw new Error("Failed to delete stock");
              }
            } catch (error) {
              console.error("Error deleting stock:", error);
              toast.error("Failed to delete stock");
            } finally {
              setLoading(false);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleUpdate = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  const totalChange = stocks.reduce(
    (sum, stock) => sum + stock.priceChange * stock.quantity,
    0
  );
  const totalPurchaseValue = stocks.reduce(
    (sum, stock) => stock.purchasePrice * stock.quantity + sum,
    0
  );
  const totalMarketValue = stocks.reduce(
    (sum, stock) => stock.currentPrice * stock.quantity + sum,
    0
  );
  const totalPercentageChange =
    ((totalMarketValue - totalPurchaseValue) / totalPurchaseValue) * 100;

  if (loading)
    return (
      <div className="loader-container">
        <div className="d-flex justify-content-center">
          <ClipLoader color="#214894" size={20} />
        </div>
      </div>
    );

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="portfolio-container">
      <div className={`portfolio-content ${isModalOpen ? "blurred" : ""}`}>
        <div className="portfolio-header justify-content-between">
          <h1>Portfolio Analysis</h1>
          <Link to="/addStock" className="add-btn">
            Add New Stock
          </Link>
        </div>

        <div className="portfolio-analysis">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title text-center">
                    Portfolio Distribution
                  </h3>
                  {stocks.length ? (
                    <Pie
                      data={pieChartData}
                      options={{
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: { font: { size: 12 } },
                          },
                        },
                      }}
                      height={100}
                    />
                  ):(
                    <p style={{ textAlign: "center", color: "#666" }}>
                      No data available
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title text-center">Holdings Summary</h3>
                  <p>
                    <strong>Total holdings :</strong> $
                    {totalMarketValue.toFixed(2)}
                    <br />
                    <strong>Total change :</strong>
                    <span
                      className={totalChange >= 0 ? "positive" : "negative"}
                    >
                      {" "}
                      {totalChange.toFixed(2)}{" "}
                    </span>
                    <br />
                    <strong>Total change% :</strong>{" "}
                    <span
                      className={
                        totalPercentageChange >= 0 ? "positive" : "negative"
                      }
                    >
                      {totalPercentageChange.toFixed(2)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title text-center">Top 5 Performers</h3>
                  {stocks.length > 0 ? (
                    <Bar
                      data={topPerformersData(stocks)}
                      options={{
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Percentage Change (%)",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Stocks",
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <p style={{ textAlign: "center", color: "#666" }}>
                      No data available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      {stocks.length > 0 ? (
      <div>
        <div className="stocks-table">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Purchase Price</th>
                  <th>Last Price</th>
                  <th>Change</th>
                  <th>Change (%)</th>
                  <th>Shares</th>
                  <th>Total Cost ($)</th>
                  <th>Market Value ($)</th>
                  <th>High Price ($)</th>
                  <th>Low Price ($)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.id}>
                    <td>{stock.symbol}</td>
                    <td>${stock.purchasePrice}</td>
                    <td>${stock.currentPrice.toFixed(2)}</td>
                    <td
                      className={
                        stock.priceChange >= 0 ? "positive" : "negative"
                      }
                    >
                      {stock.priceChange.toFixed(2)}
                    </td>
                    <td
                      className={
                        stock.priceChange >= 0 ? "positive" : "negative"
                      }
                    >
                      {stock.percentageChange.toFixed(2)}%
                    </td>
                    <td>{stock.quantity}</td>
                    <td>
                      ${(stock.purchasePrice * stock.quantity).toFixed(2)}
                    </td>
                    <td>${(stock.currentPrice * stock.quantity).toFixed(2)}</td>
                    <td>${stock.highPrice.toFixed(2)}</td>
                    <td>${stock.lowPrice.toFixed(2)}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleUpdate(stock)}
                        className="icon-button"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(stock.id)}
                        className="icon-button delete"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <div className="d-flex justify-content-end">
          <button onClick={handleDeleteAll} className="btn btn-outline-danger mt-4">
          Delete Portfolio
          </button>
        </div>
      </div>
      ) : (
        <div className="no-stocks text-center">
          <p>No stocks found. Add a new stock to get started.</p>
        </div>
      )}
      </div>
          

      {/* Modal */}
      {isModalOpen && selectedStock && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateStockModalLabel">
                  Update Stock
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleStockSave();
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Symbol:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedStock.symbol}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedStock.quantity}
                      onChange={(e) =>
                        setSelectedStock({
                          ...selectedStock,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Purchase Price:</label>
                    <input
                      type="number"
                      className="form-control"
                      step="0.01"
                      value={selectedStock.purchasePrice}
                      onChange={(e) =>
                        setSelectedStock({
                          ...selectedStock,
                          purchasePrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn add-btn">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
