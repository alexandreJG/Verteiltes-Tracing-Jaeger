console.log('Orders is running...');

const opentelemetry = require('@opentelemetry/api');

const express = require("express")
const app = express()
const axios = require("axios")

const bodyParser = require("body-parser")
app.use(bodyParser.json())

const tracer = opentelemetry.trace.getTracer(
    'instrumentation-orders',
    '1.0.0'
)

const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://adminjaeger:adminpassword@demojaeger.fd6ahhv.mongodb.net/", () => {
    console.log("Database connected - Orders")
})

require("./Order")
const Order = mongoose.model("Order")


app.post("/order", (req, res) => {
    var newOrder = {
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder)

    order.save().then(() => {
        res.send("Order created with success!")
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})


app.get("/orders", (req, res) => {
    Order.find().then((books) => {
        res.json(books)
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})


// Communicating with other services
app.get("/order/:id", (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order){
            
            axios.get("http://localhost:5555/customer/" + order.CustomerID).then((response) => {
                var orderObject = {customerName: response.data.name, bookTitle: ''}

                axios.get("http://localhost:4545/book/" + order.BookID).then((response) => {
                    orderObject.bookTitle = response.data.title
                    res.json(orderObject)
                })
            })
        }else{
            res.send("invalid Order")
        }
    })
})


app.listen(7777, () => {
    console.log("Orders service running")
})