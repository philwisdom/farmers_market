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

app.post('/create_sale', db.createSale)
app.get('/sales_report', db.getSalesReport)
app.get('/sales', db.getSales)
app.get('/sales/:id', db.getSaleById)
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

/* 
APIs to add : 

- add new inventory (PUT for bins to increase quantity)
- make a sale that updates the bin quantity as well as creates a sale and sale items

- sales reports
  - query for vendor sales given created_at between x and y [ DONE ] 

Talking points / caveats : 
- I did not add constraints in the DB (there should be!!)
  - we can add validation at the API level as well as in the DB constraints 
- I did not index the database since it's a small example
- database queries could be abstracted out so you can swap out database; keep APIs generic
- price is set on the product, but vendors may want to set their own prices


- testing : 
  - add tests

*/ 