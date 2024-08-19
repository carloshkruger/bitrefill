import { Bitrefill } from "./bitrefill";
import { Invoice } from "./resources/invoices/types";

const bitrefill = new Bitrefill({
  apiId: "your_api_id",
  apiSecret: "your_api_secret"
});

async function runDemo() {
  const products = await bitrefill.products.listAll({
    include_test_products: true
  });
  const testProductNames = products
    .filter((product) => product.id.startsWith("test-"))
    .map((product) => product.name);
  console.log(`Test products: ${testProductNames.join(", ")}`);

  await bitrefill.invoices.create(
    {
      products: [
        {
          product_id: "test-gift-card-code",
          value: 10,
          quantity: 1
        }
      ],
      payment_method: "balance",
      auto_pay: true
    },
    {
      onInvoiceCompleted: async (invoice: Invoice) => {
        console.log(
          `Gift card code: ${invoice.orders[0].redemption_info?.code}`
        );
      }
    }
  );

  try {
    await bitrefill.invoices.create({
      products: [
        {
          product_id: "test-phone-refill-fail",
          value: 10,
          quantity: 1
        }
      ],
      payment_method: "balance",
      auto_pay: true
    });
  } catch (error: any) {
    console.error(`Error message received: ${error.message}`);
  }
}

runDemo();
