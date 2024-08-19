# Bitrefill Node.js SDK

Node.js library for the Bitrefill B2B API.

## Install

This is just a demonstration of how this library would be used. It is not published on NPM.

```bash
npm install bitrefill
```

## Usage

### Setup

```js
import { Birefill } from "birefill";

const birefill = new Birefill({
  apiKey: "your_api_key",
  apiSecret: "your_api_secret",
});
```

### Create an invoice with automatic balance payment
```js
  // Use the attribute "auto_pay" = true
  await bitrefill.invoices.create({
    products: [
      {
        product_id: "product_1",
        value: 10,
        quantity: 1
      }
    ],
    payment_method: "balance",
    auto_pay: true,
    webhook_url: "<some url>" // Optional. A url that we should send the invoice to when it reaches the final stage.
  })
```

### Create an invoice with triggered balance payment
```js
  // Use the attribute "auto_pay" = false
  const invoice = await bitrefill.invoices.create({
    products: [
      {
        product_id: "product_1",
        value: 10,
        quantity: 1
      }
    ],
    payment_method: "balance",
    auto_pay: false,
    webhook_url: "<some url>"
  })

  // Later, you can call the pay method
  await bitrefill.invoices.pay(invoice.id)
```

### Create an invoice using Bitcoin as payment
```js
  /**
   * The refund_address is where we send the payment back to 
   * if there's any issue with an already paid for purchase
   */
  const invoice = await bitrefill.invoices.create({
    products: [
      {
        product_id: "product_1",
        value: 10,
        quantity: 1
      }
    ],
    payment_method: "bitcoin",
    refund_address: "<some address>",
    webhook_url: "<some url>"
  })

  console.log(invoice.payment)

  // {
  //   "method": "bitcoin",
  //   "address": "<some address>", // This is the address that you will need to send the payment to
  //   "currency": "BTC",
  //   "price": 0.00025000, // This is the price in Bitcoin
  //   "status": "unpaid"
  // }
```

### Create an invoice and execute a callback when the invoice is completed

#### This callback is executed in the background

```js
  // Use the attribute "auto_pay" = true
  await bitrefill.invoices.create(
    {
      products: [
        {
          product_id: "product_1",
          value: 10,
          quantity: 1
        }
      ],
      payment_method: "balance",
      auto_pay: true,
    },
    {
      onInvoiceCompleted: async (invoice: Invoice) => {
        console.log(invoice)
      }
    }
  )
```

### Retrieve an invoice

```js
  const invoice = await bitrefill.invoices.retrieve('invoice_id')
```

### Retrieve an order

```js
  const order = await bitrefill.orders.retrieve('order_id')
```

### Retrieve all products

```js
  // You can retrieve all products at once with one call
  const products = await bitrefill.products.listAll();
```

### Retrieve account balance

```js
  const accountBalance = await bitrefill.misc.accountBalance()
```
