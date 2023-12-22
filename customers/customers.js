//module.exports = function () {
    console.log('Customers is running...');

const opentelemetry = require('@opentelemetry/api');
const tracer = opentelemetry.trace.getTracer(
    'instrumentation-customers',
    '1.0.0'
)

const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.json())

const mongoose = require("mongoose");
const { default: span } = require('jaeger-client/dist/src/span');


mongoose.connect("mongodb+srv://adminjaeger:adminpassword@demojaeger.fd6ahhv.mongodb.net/", () => {
    console.log("Database is connected")
})

require("./Customer")
const Customer = mongoose.model("Customer")


app.post("/customer", (req, res) => {

    var newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    }

    var span = tracer.startSpan("post customers");
    span.end();

    var customer = new Customer(newCustomer)

    customer.save().then(() => {
        res.send("Customer created")
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})

app.get("/customers", (req, res) => {
    tracer.startSpan((span) => {
        Customer.find().then((customers) => {
            res.json(customers)
        }).catch(err => {
            if(err) {
                throw err;
            }
        })
        span.end();
    })
})

app.get("/customer/:id", (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if(customer){
            res.json(customer)
        }else{
            res.send("Invalid ID")
        }
    
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})

app.delete("/customer/:id", (req, res) => {
    Customer.findByIdAndRemove(req.params.id, {useFindAndModify: false}).then(() => {
        res.send("Customer deleted successfully")
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})




app.listen("5555", () => {
    console.log("Customers Service running")
})