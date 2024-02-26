const express = require('express')
const axios = require('axios')
var bodyParser = require('body-parser')
const path = require('path');
const { env } = require('process');
const app = express();

const base_url = "http://localhost:3000"

app.set("views" , path.join(__dirname , "/public/views"))
app.set("view engine" , "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))

app.use(express.static(__dirname + "/public"))

app.get("/products" , async (req,res) => {
    try {
        const response = await axios.get("http://localhost:3000/products/")
    res.render("products/viewAll" , { product : response.data })
    } catch(err) {
        res.status(500).send(err)
    }  
})

app.get("/products/:id" , async (req,res) => {
    try {
        const response = await axios.get(base_url + "/products/" + req.params.id)
    res.render("products/view" , { product : response.data })
    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/product/create" , async (req,res) => {
    try {
    res.render("products/create")
    } catch(err) {
        res.status(500).send(err)
    }    
})


app.post("/product/create" , async (req,res) => {
    try {
        const data = { product_code : req.body.product_code ,
            product_name : req.body.product_name ,
            category_id : req.body.category_id,
            unit : req.body.unit,
            price : req.body.price}
        await axios.post(base_url + "/products/"  , data )
        res.redirect("/products/")
    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/product/update/:id" , async (req,res) => {
    try {         
        const response = await axios.get(base_url + "/products/" + req.params.id)
    res.render("products/update" ,{ product : response.data })
    } catch(err) {
        res.status(500).send(err)
    }    
})

app.post("/product/update/:id" , async (req,res) => {
    try {
        const data = { product_code : req.body.product_code ,
            product_name : req.body.product_name ,
            category_id : req.body.category_id,
            unit : req.body.unit,
            price : req.body.price}
        await axios.put(base_url + "/products/" + req.params.id, data )
        res.redirect("/products/")


    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/product/delete/:id" , async (req,res) => {
    try{
        await axios.delete(base_url + "/products/" + req.params.id)
        res.redirect("/products")
    } catch(err){
        res.status(500).send(err)
    }

})

// User
app.get("/users" , async (req,res) => {
    try {
        const response = await axios.get("http://localhost:3000/users/")
    res.render("User/usersAll" , { users : response.data })
    } catch(err) {
        res.status(500).send(err)
    }  
})

app.get("/users/:id" , async (req,res) => {
    try {
        const response = await axios.get(base_url + "/users/" + req.params.id)
    res.render("User/user" , { user : response.data })
    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/user_create" , async (req,res) => {
    try {
    res.render("User/create")
    } catch(err) {
        res.status(500).send(err)
    }    
})

app.post("/user_create" , async (req,res) => {
    try {
        const data = { user_name : req.body.user_name ,
            email : req.body.email ,
            password : req.body.password}
        await axios.post(base_url + "/users/"  , data )
        res.redirect("/users/")
    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/users/update/:id" , async (req,res) => {
    try {         
        const response = await axios.get(base_url + "/users/" + req.params.id)
    res.render("User/update" ,{ users : response.data })
    } catch(err) {
        res.status(500).send(err)
    }    
})

app.post("/users/update/:id" , async (req,res) => {
    try {
        const data = { user_name : req.body.user_name ,
            email : req.body.email ,
            password : req.body.password}
        await axios.put(base_url + "/users/" + req.params.id, data )
        res.redirect("/users/")


    } catch(err) {
        res.status(500).send(err)
    }
    
})

app.get("/users/delete/:id" , async (req,res) => {
    try{
        await axios.delete(base_url + "/users/" + req.params.id)
        res.redirect("/users")
    } catch(err){
        res.status(500).send(err)
    }

})
// User

//orders

app.get("/orders", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:3000/orders/");
        res.render("orders/ordersAll", { orders: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/orders/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/orders/" + req.params.id);
        res.render("orders/orders", { orders: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/order/create", async (req, res) => {
    try {
    res.render("orders/create");
} catch(err) {
    res.status(500).send(err)
}   
});

app.post('/order/create', async (req, res) => {
    try {
        const data = {
            orders_id: req.body.orders_id,
            products_id: req.body.products_id,
            user_id: req.body.user_id
        };
        await axios.post(base_url + '/orders/', data); 
        res.redirect('/orders/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/orders/update/:id", async (req, res) => {
    try {         
        const response = await axios.get(base_url + "/orders/" + req.params.id);
        res.render("orders/update", { orders: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.post("/orders/update/:id", async (req, res) => {
    try {
        const data = {
            orders_id: req.body.orders_id,
            products_id: req.body.products_id,
            user_id: req.body.user_id
        };
        await axios.put(base_url + '/orders/' + req.params.id, data); 
        res.redirect('/orders/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/orders/delete/:id", async (req, res) => {
    try {
        await axios.delete(base_url + "/orders/" + req.params.id);
        res.redirect("/orders");
    } catch(err) {
        res.status(500).send(err);
    }
});

//categorie

app.get("/categories", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:3000/categories/");
        res.render("categories/categoriesAll", { categories: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/categories/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/categories/" + req.params.id);
        res.render("categories/categories", { categories: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/categorie/create", async (req, res) => {
    try {
        res.render("categories/create");
    } catch(err) {
        res.status(500).send(err)
    }   
});

app.post('/categorie/create', async (req, res) => {
    try {
        const data = {
            category_id: req.body.categories_id,
            category_name: req.body.categories_name,
        };
        await axios.post(base_url + '/categories/', data); 
        res.redirect('/categories/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/categories/update/:id", async (req, res) => {
    try {         
        const response = await axios.get(base_url + "/categories/" + req.params.id);
        res.render("categories/update", { categories: response.data });
    } catch(err) {
        res.status(500).send(err);
    }
});

app.post("/categories/update/:id", async (req, res) => {
    try {
        const data = {
            category_name: req.body.category_name,
        };
        await axios.put(base_url + '/categories/' + req.params.id, data); 
        res.redirect('/categories/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/categories/delete/:id", async (req, res) => {
    try {
        await axios.delete(base_url + "/categories/" + req.params.id);
        res.redirect("/categories");
    } catch(err) {
        res.status(500).send(err);
    }
});

app.listen(5500 , () => {
    console.log("Server start on port 5500")
})