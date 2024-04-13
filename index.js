const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())


const orders = []

const checkIdExists = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    if (index === -1) {
        return response.status(404).json({ message: "Order not found" })
    }
    next()
}

// Middleware para logar o método e a URL da requisição
const logRequest = (request, response, next) => {
    console.log(`${request.method} ${request.url}`)
    next()
}

app.use(logRequest)


app.get('/orders', (request, response) => {
     return response.status(201).json({ orders })
})
app.post('/orders', (request, response) => {
    const { order: newOrder, clientName, price } = request.body
    
    const order = { id: uuid.v4(), order: newOrder, clientName, price, status: "em preparação"}

    orders.push(order)

    return response.status(201).json({ order })
})
app.put('/orders/:id', checkIdExists, (request, response) => {
    const { id } = request.params
    const { order: newOrder, clientName, price } = request.body

    const updateOrder = { id, order: newOrder, clientName, price }

    const index = orders.findIndex(orders => orders.id === id)

    if(index < 0){
        return response.status(404).json({ message: "Order not found" })
    }
    orders [index] = updateOrder
    return response.status(201).json({ updateOrder })
})
app.delete('/orders/:id', checkIdExists, (request, response) => {
    const { id } = request.params
    const index = orders.findIndex(orders => orders.id === id)

    if(index < 0){
        return response.status(404).json({ message: "Order not found" })
    }
    orders.splice(index,1)

    return response.status(204).json()
})
app.get('/orders/:id', checkIdExists, (request, response) => {
    const { id } = request.params
    const order = orders.find(order => order.id === id)
    return response.status(200).json({ order })
})
app.patch('/orders/:id', checkIdExists, (request, response) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    orders[index].status = "Pronto"

    return response.status(200).json({ updatedOrder: orders[index] })
})

app.listen(port, () =>{
    console.log(`Server started on port ${port}`)
})