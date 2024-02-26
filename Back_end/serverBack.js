require('dotenv').config();

const Sequelize = require('sequelize');
const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

// connect to database
const db = new sqlite3.Database('./Database/shopBatmintan.sqlite');
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS products(
    product_id INTEGER PRIMARY KEY,
    product_code TEXT , product_name TEXT,
    category_id INTEGER , unit INTEGER , price INTEGER 
)`)

/////////// Products /////////////
app.get("/products", (req, res) => {
    db.all('SELECT * FROM products', (err, row) => {
        if (err) res.status(500).send(err);
        else res.json(row)
    });

});

app.get("/products/:id", (req, res) => {
    const products = req.params
    db.get('SELECT * FROM products WHERE product_id = ?', products.id, (err, row) => {
        if (err) res.status(500).send(err);
        else {
            if (!row) res.status(404).send("products not found!!");
            else res.json(row)
        }
    });
});

app.post("/products", (req, res) => {
    const products = req.body
    db.run('INSERT INTO products (product_code ,category_id,product_name ,unit ,price) VALUES (?,?,?,?,?)',
     products.product_code ,products.category_id, products.product_name , products.unit, products.price, 
     function(err) {
        if (err) res.status(500).send(err);
        else {
            req.body.products_id = this.lastID;
            res.send(products);
        }
    });
});

app.put("/products/:id", (req, res) => {
    const products = req.body;
    db.run('UPDATE products SET product_code = ? ,category_id = ?,product_name = ?,unit = ? ,price = ? WHERE product_id = ? ' ,
    products.product_code,products.category_id,products.product_name, products.unit ,products.price, req.params.id, 
    function(err) {
        if (err) res.status(500).send(err);
        else res.send(products);
    });
});

app.delete("/products/:id", (req, res) => {
    db.run('DELETE FROM products WHERE product_id = ?', req.params.id, function(err) {
        if(err) { 
            res.status(500).send(err);
        }
        else {
            res.send("Delete Pass ");
        }
    });

});
/////////// Products /////////////

/////////// User /////////////
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/shopBatmintan.sqlite',
})

const Users = sequelize.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

sequelize.sync()

app.get('/users/', (req, res) => {

    Users.findAll()
        .then((users) => {

            res.json(users)

        })
        .catch((err) => {

            res.status(500).send(err)

        });
})

app.get('/users/:id', (req, res) => {

    Users.findByPk(req.params.id).then((user) => {

        if (!user) {

            res.status(404).send("User not found")

        } else {

            res.json(user)

        }
    }).catch((err) => {

        res.status(500).send(err)

    });
});

app.post('/users', (req, res) => {

    Users.create(req.body).then((user) => {

        res.send(user)

    }).catch((err) => {

        res.status(500).send(err)

    });
})

app.put('/users/:id', (req, res) => {

    Users.findByPk(req.params.id).then((user) => {

        if (!user) {

            res.status(404).send("User not found")

        } else {
            user.update(req.body).then(() => {

                res.send(user)

            }).catch((err) => {

                res.status(500).send(err)

            });
        }
    }).catch((err) => {

        res.status(500).send(err)

    });
});

app.delete('/users/:id', (req, res) => {

    Users.findByPk(req.params.id).then((user) => {

        if (!user) {

            res.status(404).send("User not found")

        } else {

            user.destroy().then(() => {

                res.send({})

            }).catch((err) => {

                res.status(500).send(err)

            });
        }
    }).catch((err) => {

        res.status(500).send(err)

    });
});

/////////// User /////////////

/////////// orders /////////////

const orders = sequelize.define('orders', {
    orders_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, 
    products_id:{
        type: Sequelize.STRING,
        foreignKey: false
    },
    user_id:{
        type: Sequelize.STRING,
        foreignKey: false
    }
});

const categories = sequelize.define('categories', { 
    category_id: { 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

sequelize.sync();

app.post('/orders', async (req, res) => {
    try {
        const newOrder = await orders.create(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const allOrders = await orders.findAll();
        res.json(allOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/orders/:id', async (req, res) => {
    try {
        const order = await orders.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
        } else {
            res.json(order);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/orders/:id', async (req, res) => {
    try {
        const order = await orders.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
        } else {
            await order.update(req.body);
            res.json(order);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/orders/:id', async (req, res) => {
    try {
        const order = await orders.findByPk(req.params.id);
        if (!order) {
            res.status(404).json({ error: 'ไม่พบคำสั่งซื้อ' });
        } else {
            await order.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/////////// orders /////////////


/////////// categories /////////////

app.post('/categories', async (req, res) => {
    try {
        const newCategory = await categories.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories', async (req, res) => {
    try {
        const allCategories = await categories.findAll();
        res.json(allCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories/:id', async (req, res) => {
    try {
        const category = await categories.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
        } else {
            res.json(category);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/categories/:id', async (req, res) => {
    try {
        const category = await categories.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
        } else {
            await category.update(req.body);
            res.json(category);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/categories/:id', async (req, res) => {
    try {
        const category = await categories.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({ error: 'ไม่พบหมวดหมู่' });
        } else {
            await category.destroy();
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/////////// categories /////////////


app.listen(3000, () => { console.log(`Listening on port ${3000}`) })

