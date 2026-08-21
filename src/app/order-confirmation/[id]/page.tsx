import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { getOrder } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Order confirmed – Arte Collective",
};

function formatPrice(amount: number, currencyCode: string) {
  // Same rationale as checkout/OrderSummary.tsx's formatPrice: real Artelo
  // shipping totals (e.g. $4.91) need their actual decimal value shown,
  // while existing whole-dollar prices keep displaying exactly as before.
  const formatted = Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);
  return `$${formatted} ${currencyCode.toUpperCase()}`;
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const shippingMethod = order.shipping_methods?.[0];
  const address = order.shipping_address;

  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />

      <div className="mx-auto w-full max-w-[720px] px-5 pb-24 pt-[86px] sm:pt-[104px]">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[13px] uppercase tracking-wide text-arte-orange">Thank you</p>
          <h1 className="mb-3 text-[28px] font-light text-arte-text sm:text-[32px]">
            Your order is confirmed
          </h1>
          <p className="text-[14px] text-arte-text-muted">
            Order #{order.display_id ?? order.id}
            {order.email ? <> — a confirmation was sent to {order.email}</> : null}
          </p>
        </div>

        <div className="border-[0.8px] border-[#e5e5e5] p-[30px]">
          <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-wide text-arte-text">
            Items
          </h2>
          <div className="flex flex-col gap-4">
            {(order.items ?? []).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden bg-[#e5e5e5]">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.product_title ?? item.title}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  ) : null}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-arte-text text-[10px] text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-arte-text">{item.product_title ?? item.title}</p>
                  {item.variant_title ? (
                    <p className="text-[11px] text-arte-text-muted">Size: {item.variant_title}</p>
                  ) : null}
                </div>
                <div className="text-[13px] text-arte-text">
                  {formatPrice(item.unit_price * item.quantity, order.currency_code)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-[#e5e5e5] pt-4 text-[13px]">
            <div className="flex justify-between text-arte-text">
              <span>Subtotal</span>
              <span>{formatPrice(order.item_subtotal, order.currency_code)}</span>
            </div>
            <div className="flex justify-between text-arte-text-muted">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
            </div>
            {order.tax_total > 0 ? (
              <div className="flex justify-between text-arte-text-muted">
                <span>Taxes</span>
                <span>{formatPrice(order.tax_total, order.currency_code)}</span>
              </div>
            ) : null}
            {order.discount_total > 0 ? (
              <div className="flex justify-between text-arte-orange">
                <span>Discount</span>
                <span>-{formatPrice(order.discount_total, order.currency_code)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-[#e5e5e5] pt-2 text-[15px] font-semibold text-arte-text">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency_code)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {address ? (
            <div className="border-[0.8px] border-[#e5e5e5] p-[30px]">
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-arte-text">
                Shipping address
              </h2>
              <p className="text-[13px] leading-relaxed text-arte-text-muted">
                {address.first_name} {address.last_name}
                <br />
                {address.address_1}
                {address.address_2 ? (
                  <>
                    <br />
                    {address.address_2}
                  </>
                ) : null}
                <br />
                {address.city}, {address.province} {address.postal_code}
              </p>
            </div>
          ) : null}

          <div className="border-[0.8px] border-[#e5e5e5] p-[30px]">
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-arte-text">
              Order details
            </h2>
            <dl className="space-y-2 text-[13px] text-arte-text-muted">
              {shippingMethod ? (
                <div className="flex justify-between">
                  <dt>Shipping method</dt>
                  <dd className="text-arte-text">{shippingMethod.name}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt>Payment status</dt>
                <dd className="text-arte-text">{formatStatus(order.payment_status)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Fulfillment status</dt>
                <dd className="text-arte-text">{formatStatus(order.fulfillment_status)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
