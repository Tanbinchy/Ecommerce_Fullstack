import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { getApiMessage } from "../api/axiosInstance";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        if (isMounted) setProduct(response.data.payload.product);
      } catch (error) {
        if (isMounted) setError(getApiMessage(error, "Product not found"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const addToCart = () => {
    addItem(product, quantity);
    setMessage("Added to cart");
  };

  if (isLoading) {
    return (
      <section className="section-shell py-16">
        <div className="h-[32rem] animate-pulse rounded-[8px] bg-white/80" />
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section-shell py-16">
        <div className="panel p-8 text-center text-rose-700">{error}</div>
      </section>
    );
  }

  return (
    <>
      <PageTitle title={product.name} />
      <section className="section-shell grid gap-8 py-10 lg:grid-cols-2 lg:py-16">
        <div className="panel overflow-hidden p-4">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="aspect-square w-full rounded-[8px] object-cover"
            loading="eager"
          />
        </div>
        <div className="grid content-center gap-6">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-teal-700 hover:text-slate-950"
          >
            Back to shop
          </Link>
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-teal-700">
              {product.category?.name || "Product"}
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {product.description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="panel p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Price
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {formatPrice(product.price)}
              </p>
            </div>
            <div className="panel p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Stock
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {product.quantity}
              </p>
            </div>
            <div className="panel p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Sold
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {product.sold || 0}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 overflow-hidden rounded-[8px] border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="grid w-12 place-items-center text-slate-600 hover:bg-slate-100"
                title="Decrease quantity"
              >
                <Icon name="minus" className="h-4 w-4" />
              </button>
              <input
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="w-16 border-x border-slate-200 text-center font-bold outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="grid w-12 place-items-center text-slate-600 hover:bg-slate-100"
                title="Increase quantity"
              >
                <Icon name="plus" className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              <Icon name="bag" className="h-5 w-5" />
              Add to cart
            </button>
            {message && (
              <span className="text-sm font-semibold text-emerald-700">
                {message}
              </span>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
