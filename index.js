const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Welcome to the Farmers Market!' })
})

app.get('/sales', db.getSales)
app.get('/sales/:id', db.getSaleById)
app.post('/create_sale', db.createSale)
app.get('/sales_report', db.getSalesReport)


// could add sales_report to vendors path
app.get('/vendors', db.getVendors)
app.get('/vendors/:id', db.getVendorById)
app.get('/vendors/:id/stock', db.getVendorStockById)
app.get('/vendors/:id/sales', db.getSalesByVendorId)
app.get('/vendors/:id/employees', db.getEmployeesByVendorId)

app.get('/locations', db.getLocations)
app.get('/locations/:id', db.getLocationById)

app.get('/products', db.getProducts)
app.get('/products/:id', db.getProductById)
app.get('/products/:id/locations', db.getProductLocationsById)

app.get('/bins', db.getBins)
app.get('/bins/:id', db.getBinById)
app.put('/bins/:id', db.updateBin)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})