import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const Cart = () => {
  const { items, totals, updateQuantity, removeItem } = useCart();

  return (
    <>
      <PageTitle title="Cart" />
      <section className="section-shell grid gap-8 py-10 lg:grid-cols-[1fr_22rem] lg:py-16">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-teal-700">
              Shopping cart
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Your selected products
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="panel grid min-h-80 place-items-center p-8 text-center">
              <div>
                <Icon
                  name="bag"
                  className="mx-auto h-10 w-10 text-slate-300"
                />
                <h2 className="mt-4 text-2xl font-black text-slate-950">
                  Cart is empty
                </h2>
                <p className="mt-2 text-slate-500">
                  Add products from the storefront and they will appear here.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                >
                  Start shopping
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => {
                const productKey = item._id || item.slug;
                return (
                  <article
                    key={productKey}
                    className="panel grid gap-4 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="aspect-square w-full rounded-[8px] object-cover sm:w-28"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.slug}`}
                        className="text-lg font-black text-slate-950 hover:text-teal-700"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatPrice(item.price)} each
                      </p>
                      <div className="mt-3 flex h-10 w-fit overflow-hidden rounded-[8px] border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(productKey, item.quantity - 1)
                          }
                          className="grid w-10 place-items-center hover:bg-slate-100"
                          title="Decrease quantity"
                        >
                          <Icon name="minus" className="h-4 w-4" />
                        </button>
                        <input
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(productKey, event.target.value)
                          }
                          className="w-14 border-x border-slate-200 text-center text-sm font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(productKey, item.quantity + 1)
                          }
                          className="grid w-10 place-items-center hover:bg-slate-100"
                          title="Increase quantity"
                        >
                          <Icon name="plus" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:grid sm:justify-items-end">
                      <p className="text-xl font-black text-slate-950">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(productKey)}
                        className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                        title="Remove item"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="panel h-fit p-5 lg:sticky lg:top-24">
          <h2 className="text-xl font-black text-slate-950">Order summary</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-950">
                {formatPrice(totals.subtotal)}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-950">
                {formatPrice(totals.shipping)}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Tax</span>
              <span className="font-semibold text-slate-950">
                {formatPrice(totals.tax)}
              </span>
            </div>
            <div className="mt-2 flex justify-between gap-4 border-t border-slate-200 pt-4 text-lg font-black text-slate-950">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[8px] px-5 py-3 text-sm font-bold text-white transition ${
              items.length
                ? "bg-slate-950 hover:bg-teal-700"
                : "pointer-events-none bg-slate-300"
            }`}
          >
            Checkout
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </aside>
      </section>
    </>
  );
};

export default Cart;
