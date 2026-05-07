import { Link } from "react-router-dom";
import Icon from "./Icon";
import ProductImage from "./ProductImage";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const ProductCard = ({ product, onAdd }) => {
  const stockLevel = Number(product.quantity || 0);

  return (
    <article className="group grid overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.slug}`} className="relative block bg-slate-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {product.category?.name || "Featured"}
        </span>
      </Link>
      <div className="grid gap-4 p-4">
        <div className="grid gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="line-clamp-2 text-base font-semibold text-slate-950 hover:text-teal-700"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-950">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-slate-500">{stockLevel} in stock</p>
          </div>
          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={stockLevel < 1}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            title="Add to cart"
          >
            <Icon name="bag" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
