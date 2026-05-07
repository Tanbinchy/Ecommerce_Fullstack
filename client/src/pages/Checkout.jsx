import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiMessage } from "../api/axiosInstance";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import ProductImage from "../components/ProductImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const Checkout = () => {
  const { user } = useAuth();
  const { items, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    paymentMethod: "cash-on-delivery",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/orders", {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        items: items.map((item) => ({
          product: item._id,
          slug: item.slug,
          quantity: item.quantity,
        })),
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });

      clearCart();
      setMessage(`Order placed: ${response.data.payload.order._id}`);
      window.setTimeout(() => navigate("/"), 1800);
    } catch (error) {
      setError(getApiMessage(error, "Could not place order"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="section-shell py-16">
        <PageTitle title="Checkout" />
        <div className="panel p-8 text-center">
          <Icon name="bag" className="mx-auto h-10 w-10 text-slate-300" />
          <h1 className="mt-4 text-3xl font-black text-slate-950">
            Nothing to checkout
          </h1>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            Browse products
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageTitle title="Checkout" />
      <section className="section-shell grid gap-8 py-10 lg:grid-cols-[1fr_24rem] lg:py-16">
        <form className="panel grid gap-6 p-5 sm:p-7" onSubmit={placeOrder}>
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-teal-700">
              Checkout
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Shipping details
            </h1>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Full name
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                className="form-field"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                className="form-field"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Phone
              <input
                required
                name="phone"
                value={form.phone}
                onChange={updateField}
                className="form-field"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Payment
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={updateField}
                className="form-field"
              >
                <option value="cash-on-delivery">Cash on delivery</option>
                <option value="card">Card</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Address
            <textarea
              required
              name="address"
              value={form.address}
              onChange={updateField}
              className="form-field min-h-28 resize-y"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={updateField}
              className="form-field min-h-24 resize-y"
            />
          </label>
          {error && (
            <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:bg-slate-300"
          >
            <Icon name="check" className="h-5 w-5" />
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="panel h-fit p-5 lg:sticky lg:top-24">
          <h2 className="text-xl font-black text-slate-950">Review order</h2>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={item._id || item.slug} className="flex gap-3">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-[8px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-bold text-slate-950">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-slate-950">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold">{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span className="font-bold">{formatPrice(totals.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax</span>
              <span className="font-bold">{formatPrice(totals.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Checkout;
