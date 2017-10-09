
CREATE TABLE IF NOT EXISTS pricevariants(id INTEGER PRIMARY KEY AUTOINCREMENT, id_real INTEGER, name TEXT,price TEXT,sku TEXT,barcode TEXT,image TEXT,itemId TEXT);

CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY AUTOINCREMENT, id_real INTEGER, name TEXT, image TEXT, category_id INTEGER);

CREATE TABLE IF NOT EXISTS itemsonticket(id INTEGER PRIMARY KEY AUTOINCREMENT, pv_id INTEGER, qty INTEGER);

CREATE TABLE IF NOT EXISTS discounts(id INTEGER PRIMARY KEY AUTOINCREMENT, id_real INTEGER, name TEXT, value TEXT, type TEXT, status INTEGER);

CREATE TABLE IF NOT EXISTS discountsonticket(id INTEGER PRIMARY KEY AUTOINCREMENT, discount_id INTEGER, itemsonticket_id INTEGER);

