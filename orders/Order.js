const mongoose = require('mongoose')


mongoose.model("Order", {
    CustomerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    BookID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    initialDate: {
        type: Date,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    }
})

