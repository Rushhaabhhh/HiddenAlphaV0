package main

import (
	"encoding/csv"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Stock struct {
	StockName         string  `json:"Stock Name"`
	MarketCap         float64 `json:"Market Capitalization"`
	PERatio           float64 `json:"P/E Ratio"`
	ROE               float64 `json:"ROE"`
	DebtEquityRatio   float64 `json:"Debt/Equity Ratio"`
	DividendYield     float64 `json:"Dividend Yield"`
	RevenueGrowth     float64 `json:"Revenue Growth"`
	EPSGrowth         float64 `json:"EPS Growth"`
	CurrentRatio      float64 `json:"Current Ratio"`
	GrossMargin       float64 `json:"Gross Margin"`
}

type FilterRequest struct {
	Query string `json:"query"`
}

type FilterCondition struct {
	Parameter string
	Operator  string
	Value     float64
}

func loadStocksFromCSV(filename string) ([]Stock, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	var stocks []Stock
	for i, record := range records[1:] {
		stock, err := parseStockRecord(record)
		if err != nil {
			log.Printf("Error parsing record %d: %v", i+1, err)
			continue
		}
		stocks = append(stocks, stock)
	}

	return stocks, nil
}

func parseStockRecord(record []string) (Stock, error) {
	toFloat := func(val string) (float64, error) {
		return strconv.ParseFloat(strings.TrimSpace(val), 64)
	}

	marketCap, err := toFloat(record[1])
	if err != nil {
		return Stock{}, err
	}

	peRatio, _ := toFloat(record[2])
	roe, _ := toFloat(record[3])
	debtEquity, _ := toFloat(record[4])
	dividendYield, _ := toFloat(record[5])
	revenueGrowth, _ := toFloat(record[6])
	epsGrowth, _ := toFloat(record[7])
	currentRatio, _ := toFloat(record[8])
	grossMargin, _ := toFloat(record[9])

	return Stock{
		StockName:        record[0],
		MarketCap:        marketCap,
		PERatio:          peRatio,
		ROE:              roe,
		DebtEquityRatio:  debtEquity,
		DividendYield:    dividendYield,
		RevenueGrowth:    revenueGrowth,
		EPSGrowth:        epsGrowth,
		CurrentRatio:     currentRatio,
		GrossMargin:      grossMargin,
	}, nil
}

func parseQuery(queryString string) []FilterCondition {
	var conditions []FilterCondition
	queryParts := strings.Split(queryString, "AND")

	for _, part := range queryParts {
		part = strings.TrimSpace(part)

		var operator string
		switch {
		case strings.Contains(part, ">="):
			operator = ">="
		case strings.Contains(part, "<="):
			operator = "<="
		case strings.Contains(part, ">"):
			operator = ">"
		case strings.Contains(part, "<"):
			operator = "<"
		case strings.Contains(part, "="):
			operator = "="
		default:
			continue
		}

		components := strings.Split(part, operator)
		if len(components) != 2 {
			continue
		}

		parameter := strings.TrimSpace(components[0])
		value, err := strconv.ParseFloat(strings.TrimSpace(components[1]), 64)
		if err != nil {
			continue
		}

		conditions = append(conditions, FilterCondition{
			Parameter: parameter,
			Operator:  operator,
			Value:     value,
		})
	}

	return conditions
}

func filterStocks(stocks []Stock, conditions []FilterCondition) []Stock {
	var filteredStocks []Stock

	for _, stock := range stocks {
		if matchesConditions(stock, conditions) {
			filteredStocks = append(filteredStocks, stock)
		}
	}

	return filteredStocks
}

func matchesConditions(stock Stock, conditions []FilterCondition) bool {
	for _, condition := range conditions {
		var stockValue float64
		switch condition.Parameter {
		case "Market Capitalization":
			stockValue = stock.MarketCap
		case "P/E Ratio":
			stockValue = stock.PERatio
		case "ROE":
			stockValue = stock.ROE
		case "Debt/Equity Ratio":
			stockValue = stock.DebtEquityRatio
		case "Dividend Yield":
			stockValue = stock.DividendYield
		case "Revenue Growth":
			stockValue = stock.RevenueGrowth
		case "EPS Growth":
			stockValue = stock.EPSGrowth
		case "Current Ratio":
			stockValue = stock.CurrentRatio
		case "Gross Margin":
			stockValue = stock.GrossMargin
		default:
			return false
		}

		switch condition.Operator {
		case ">":
			if stockValue <= condition.Value {
				return false
			}
		case "<":
			if stockValue >= condition.Value {
				return false
			}
		case "=":
			if stockValue != condition.Value {
				return false
			}
		case ">=":
			if stockValue < condition.Value {
				return false
			}
		case "<=":
			if stockValue > condition.Value {
				return false
			}
		}
	}
	return true
}

func main() {
	r := gin.Default()

	r.LoadHTMLGlob("templates/*")
	log.Println("Templates loaded from ./templates/")

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://hidden-alpha-v0.vercel.app"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	stocks, err := loadStocksFromCSV("StockDataset.csv")
	if err != nil {
		log.Fatalf("Failed to load stocks: %v", err)
	}

	r.GET("/stocks", func(c *gin.Context) {
		accept := c.GetHeader("Accept")
		switch {
		case strings.Contains(accept, "text/html"):
			c.HTML(http.StatusOK, "stocks.html", gin.H{"Stocks": stocks})
		default:
			c.JSON(http.StatusOK, stocks)
		}
	})

	r.POST("/filter", func(c *gin.Context) {
		var req FilterRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		filteredStocks := filterStocks(stocks, parseQuery(req.Query))
		accept := c.GetHeader("Accept")

		switch {
		case strings.Contains(accept, "text/html"):
			c.HTML(http.StatusOK, "stocks.html", gin.H{"Stocks": filteredStocks, "Query": req.Query})
		default:
			c.JSON(http.StatusOK, filteredStocks)
		}
	})

	log.Println("Server running on :8080")
	log.Fatal(r.Run(":8080"))
}
