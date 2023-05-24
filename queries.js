const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getEmployees = (request, response) => {
  pool.query('SELECT * FROM employees ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getEmployeeById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM employees WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getEmployeesByVendorId = (request, response) => {
  const vendor_id = parseInt(request.params.id)

  pool.query('SELECT * FROM employees WHERE vendor_id = $1', [vendor_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSales = (request, response) => {
  pool.query('SELECT * FROM sales ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSaleById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM sales WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSalesByVendorId = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM sales WHERE vendor_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSalesReport = (request, response) => {
  const startAt = request.query.start_at ? request.query.start_at : `CURRENT_DATE - 7`;
  const endAt = request.query.end_at ? request.query.end_at : `NOW()`;

  const vendor_ids = request.query.vendor_ids ? request.query.vendor_ids.split(',') : [];
  const display_product_name = request.query.display_product_name ? request.query.display_product_name === 'true' : false; 
  const display_price = request.query.display_price ? request.query.display_price === 'true' : false;
  const display_quantity = request.query.display_quantity ? request.query.display_quantity === 'true' : false;

  const selectArr = ['vendors.name', 'SUM(products.price * sales_items.quantity) as total_sale_amount'];
  const groupByArr = ['vendors.name'];

  if (display_product_name) { 
    selectArr.push('products.name as product_name');
    groupByArr.push('products.name');
  }
  if (display_price) { 
    selectArr.push('products.price as price');
    groupByArr.push('products.price');
  }
  if (display_quantity) { 
    selectArr.push('sales_items.quantity as quantity');
    groupByArr.push('sales_items.quantity');
  }

  // where
  const whereArr = [];

  // if specific vendors
  if (vendor_ids.length > 0) { 
    whereArr.push(`vendors.id IN (${vendor_ids.join(', ')})`)
  }

  // add start_at and end_at 
  whereArr.push(`sales.created_at BETWEEN ${startAt} AND ${endAt}`);

  const where = whereArr.join(' AND ');
  const select = selectArr.join(',');
  const groupBy = groupByArr.join(',');

  pool.query(`SELECT ${select}
    FROM sales
    JOIN sales_items on sales_items.sale_id = sales.id
    JOIN vendors on sales.vendor_id = vendors.id
    JOIN products on sales_items.product_id = products.id
    WHERE ${where}
    GROUP BY ${groupBy}`, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const createSale = async (request, response) => {
  const { vendor_id, sales_items } = request.body;

  // sample input : 
  // { 
  //   "vendor_id" : 4,
  //   "sales_items": [
  //     { "product_id": 6, "quantity": 1},
  //     { "product_id": 7, "quantity": 2 }
  //   ]
  // }

  const product_ids = sales_items.map(x => { return x.product_id }).join(',');

  const inventoryCheck = await pool.query(`SELECT
      bins.id as bin_id, bins.product_id, quantity
    FROM bins
    JOIN vendors on bins.vendor_id = ${vendor_id}
    WHERE vendors.id = 4 AND bins.product_id IN (${product_ids})`);

  let outOfInventory = false;

  // check the quantity to see if we have enough to complete the sale
  inventoryCheck.rows.every(inventoryRow => {
    // NOTE : assuming we'll only have one infinitely-sized bin of product_id per vendor
    const sales_items_row = sales_items.filter(x => { return inventoryRow.product_id === x.product_id});
    if (sales_items_row.length === 1 && sales_items_row[0].quantity <= inventoryRow.quantity) { 
      // we have enough quantity
      // add the sell quantity to this data structure for later
      inventoryRow.sell_quantity = sales_items_row[0].quantity;
    } else {
      outOfInventory = true;
      return false;
    }
    // required for every
    return true;
  });

  if (outOfInventory) {
    throw 'out of inventory'
  }

  let saleResult; 

  try {
    // create a new sale
    saleResult = await pool.query(`INSERT INTO sales (vendor_id, created_at) VALUES (${vendor_id}, NOW()) RETURNING id`);
    const sale_id = saleResult.rows[0].id;

    // create the sales_items
    const insertValues = inventoryCheck.rows.map(x => { return `(${sale_id}, ${x.product_id}, ${x.sell_quantity}, NOW())`}).join(`, `);
    const salesItemsResult = await pool.query(`INSERT INTO sales_items (sale_id, product_id, quantity, created_at) VALUES ${insertValues}`);

    // now update the quantity in the bins
    const updateBinValues = inventoryCheck.rows.map(x => { return `( ${x.bin_id}, ${x.quantity - x.sell_quantity} )` }).join(`, `);
    const binResult = await pool.query(`UPDATE bins SET quantity = nv.quantity, updated_at = NOW() FROM (VALUES ${updateBinValues}) as nv (id, quantity) WHERE bins.id = nv.id`)
  } catch(e) {
    throw e
  }

  // return the sale id
  response.status(200).json(saleResult.rows)
}

const getVendors = (request, response) => {
  pool.query('SELECT * FROM vendors ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getVendorById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM vendors WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getVendorStockById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(`
  SELECT vendors.name as vendor_name, products.name as product_name, bins.quantity from vendors
    JOIN bins on vendors.id = bins.vendor_id
    JOIN products on bins.product_id = products.id
    WHERE vendors.id = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProductById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProductLocationsById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(`SELECT vendors.name as vendor_name, products.name as product_name, locations.row, locations.shelf FROM bins
  JOIN locations on bins.location_id = locations.id
  JOIN products on bins.product_id = products.id
  JOIN vendors on bins.vendor_id = vendors.id
  WHERE bins.product_id = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getLocations = (request, response) => {
  pool.query('SELECT * FROM locations ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getLocationById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM locations WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getBins = (request, response) => {
  pool.query('SELECT * FROM bins ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getBinById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM bins WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateBin = (request, response) => {
  const id = parseInt(request.params.id)
  const quantity = request.query.quantity ? parseInt(request.query.quantity) : -1;

  if (quantity === -1) {
    throw 'no quantity provided';
  }

  pool.query(
    'UPDATE bins SET quantity = $1 WHERE id = $2',
    [quantity, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

module.exports = {
  createSale,
  getEmployees,
  getEmployeeById,
  getEmployeesByVendorId,
  getSales,
  getSaleById,
  getSalesByVendorId,
  getSalesReport,
  getVendors,
  getVendorById,
  getVendorStockById,
  getLocations,
  getLocationById,
  getProducts,
  getProductById,
  getProductLocationsById,
  getBins,
  getBinById,
  updateBin
}
