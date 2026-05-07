import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiMessage } from "../api/axiosInstance";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    const loadStorefront = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          api.get("/products?limit=100"),
          api.get("/categories?limit=100"),
        ]);

        if (!isMounted) return;
        setProducts(productResponse.data.payload.products || []);
        setCategories(categoryResponse.data.payload.categories || []);
      } catch (error) {
        if (isMounted) setError(getApiMessage(error, "Unable to load store"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadStorefront();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const categorySlug = product.category?.slug || product.category;
      const matchesCategory = category === "all" || categorySlug === category;
      return matchesSearch && matchesCategory;
    });

    return result.sort((first, second) => {
      if (sort === "price-low") return Number(first.price) - Number(second.price);
      if (sort === "price-high") return Number(second.price) - Number(first.price);
      if (sort === "best-seller") return Number(second.sold || 0) - Number(first.sold || 0);
      if (sort === "stock") return Number(second.quantity || 0) - Number(first.quantity || 0);
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });
  }, [products, search, category, sort]);

  const featuredProduct = products[0];
  const productCount = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.quantity || 0),
    0,
  );

  const handleAdd = (product) => {
    addItem(product, 1);
    setCartMessage(`${product.name} added to cart`);
    window.setTimeout(() => setCartMessage(""), 2200);
  };

  return (
    <>
      <PageTitle title="Home" />
      <section className="section-shell grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
        <div className="grid gap-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
            <Icon name="star" className="h-4 w-4" />
            Live product catalog
          </div>
          <div className="grid gap-5">
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Shop sharp electronics with a backend that can keep up.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse products, add to cart, place orders, and manage inventory
              from a responsive admin panel connected to your Express API.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Icon
                name="search"
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="form-field field-with-icon"
                placeholder="Search laptops, cameras, consoles..."
              />
            </label>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              View cart
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="panel p-4">
              <p className="text-2xl font-black text-slate-950">{productCount}</p>
              <p className="text-sm text-slate-500">Products</p>
            </div>
            <div className="panel p-4">
              <p className="text-2xl font-black text-slate-950">
                {categories.length}
              </p>
              <p className="text-sm text-slate-500">Categories</p>
            </div>
            <div className="panel p-4">
              <p className="text-2xl font-black text-slate-950">{totalStock}</p>
              <p className="text-sm text-slate-500">In stock</p>
            </div>
          </div>
        </div>

        <div className="panel overflow-hidden p-4">
          {featuredProduct ? (
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-[8px] bg-slate-100">
                <ProductImage
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="aspect-[4/3] w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-normal text-teal-700">
                    Featured pick
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {featuredProduct.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {featuredProduct.description}
                  </p>
                </div>
                <div className="rounded-[8px] bg-slate-950 px-4 py-3 text-white">
                  <p className="text-xs text-slate-300">Price</p>
                  <p className="text-xl font-black">
                    {formatPrice(featuredProduct.price)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center text-center text-slate-500">
              Products will appear here after seeding or creating inventory.
            </div>
          )}
        </div>
      </section>

      <section className="section-shell grid gap-6 pb-16">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === "all"
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                type="button"
                key={item._id}
                onClick={() => setCategory(item.slug)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category === item.slug
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-[8px] bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="bg-transparent font-bold text-slate-950 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="best-seller">Best seller</option>
              <option value="price-low">Price low</option>
              <option value="price-high">Price high</option>
              <option value="stock">Most stock</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filteredProducts.slice(0, 3).map((item) => (
            <button
              type="button"
              key={item._id}
              onClick={() => handleAdd(item)}
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
            >
              <Icon name="plus" className="h-4 w-4" />
              Quick add {item.name}
            </button>
          ))}
        </div>

        {cartMessage && (
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {cartMessage}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-[8px] bg-white/80"
              />
            ))}
          </div>
        ) : error ? (
          <div className="panel p-8 text-center text-rose-700">{error}</div>
        ) : filteredProducts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAdd={handleAdd}
              />
            ))}
          </div>
        ) : (
          <div className="panel p-8 text-center text-slate-500">
            No products match this search.
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
