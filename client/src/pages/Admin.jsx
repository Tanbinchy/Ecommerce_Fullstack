import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api, { getApiMessage } from "../api/axiosInstance";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import ProductImage from "../components/ProductImage";
import StatusPill from "../components/StatusPill";
import { useAuth } from "../context/AuthContext";
import { getEditableImageUrl } from "../utils/images";

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  sold: "0",
  shipping: "0",
  category: "",
  image: "",
};

const tabs = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "products", label: "Products", icon: "package" },
  { id: "categories", label: "Categories", icon: "tag" },
  { id: "orders", label: "Orders", icon: "receipt" },
  { id: "users", label: "Users", icon: "users" },
];

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "No date";

const Admin = () => {
  const { user, isAdmin, isCheckingSession } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [categoryName, setCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    setError("");
    setIsLoading(true);

    try {
      const [productResponse, categoryResponse, orderResponse, userResponse] =
        await Promise.all([
          api.get("/products?limit=100"),
          api.get("/categories?limit=100"),
          api.get("/orders?limit=100"),
          api.get("/users?limit=100"),
        ]);

      const nextProducts = productResponse.data.payload.products || [];
      const nextCategories = categoryResponse.data.payload.categories || [];
      const nextOrders = orderResponse.data.payload.orders || [];
      const nextUsers = userResponse.data.payload.users || [];

      setProducts(nextProducts);
      setCategories(nextCategories);
      setOrders(nextOrders);
      setUsers(nextUsers);

      if (nextCategories[0]) {
        setProductForm((current) => ({
          ...current,
          category: current.category || nextCategories[0]._id,
        }));
      }
    } catch (error) {
      setError(getApiMessage(error, "Unable to load admin data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAdminData();
  }, [isAdmin]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const stock = products.reduce(
      (sum, product) => sum + Number(product.quantity || 0),
      0,
    );
    const lowStock = products.filter((product) => Number(product.quantity) <= 5);

    return {
      revenue,
      stock,
      lowStock,
      orders: orders.length,
      users: users.length,
    };
  }, [orders, products, users]);

  const showMessage = (nextMessage) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(""), 2600);
  };

  const updateProductForm = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      ...emptyProductForm,
      category: categories[0]?._id || "",
    });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const productPayload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: productForm.price,
        quantity: productForm.quantity,
        sold: productForm.sold || "0",
        shipping: productForm.shipping || "0",
        category: productForm.category,
        image: productForm.image.trim(),
      };

      if (!productPayload.image) delete productPayload.image;

      if (editingProduct) {
        await api.put(`/products/${editingProduct.slug}`, productPayload);
        showMessage("Product updated");
      } else {
        await api.post("/products/register", productPayload);
        showMessage("Product created");
      }

      resetProductForm();
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "Product save failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const editProduct = (product) => {
    setActiveTab("products");
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      sold: product.sold || 0,
      shipping: product.shipping || 0,
      category: product.category?._id || product.category || "",
      image: getEditableImageUrl(product.image),
    });
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setError("");

    try {
      await api.delete(`/products/${product.slug}`);
      showMessage("Product deleted");
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "Product delete failed"));
    }
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.slug}`, {
          name: categoryName,
        });
        showMessage("Category updated");
      } else {
        await api.post("/categories/register", { name: categoryName });
        showMessage("Category created");
      }

      setCategoryName("");
      setEditingCategory(null);
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "Category save failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const editCategory = (category) => {
    setActiveTab("categories");
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    setError("");

    try {
      await api.delete(`/categories/${category.slug}`);
      showMessage("Category deleted");
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "Category delete failed"));
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setError("");

    try {
      await api.put(`/orders/${orderId}/status`, { status });
      showMessage("Order status updated");
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "Order update failed"));
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    setError("");

    try {
      await api.delete(`/orders/${orderId}`);
      showMessage("Order deleted");
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "Order delete failed"));
    }
  };

  const updateUserStatus = async (nextUser, action) => {
    setError("");

    try {
      await api.put(`/users/user-status/${nextUser._id}`, { action });
      showMessage(`User ${action === "ban" ? "banned" : "unbanned"}`);
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "User status update failed"));
    }
  };

  const deleteUser = async (nextUser) => {
    if (!window.confirm(`Delete ${nextUser.name}?`)) return;
    setError("");

    try {
      await api.delete(`/users/${nextUser._id}`);
      showMessage("User deleted");
      await loadAdminData();
    } catch (error) {
      setError(getApiMessage(error, "User delete failed"));
    }
  };

  if (isCheckingSession) {
    return (
      <section className="section-shell py-16">
        <div className="h-96 animate-pulse rounded-[8px] bg-white/80" />
      </section>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <section className="section-shell py-16">
        <div className="panel mx-auto max-w-xl p-8 text-center">
          <Icon name="admin" className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-5 text-3xl font-black text-slate-950">
            Admin access required
          </h1>
          <p className="mt-3 text-slate-500">
            Your account is active, but it is not marked as an admin account.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            Back to store
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageTitle title="Admin Panel" />
      <section className="section-shell grid gap-5 py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-12">
        <aside className="panel h-fit p-2 lg:sticky lg:top-24">
          <div className="hidden p-3 sm:block">
            <p className="text-xs font-bold uppercase tracking-normal text-teal-700">
              Admin panel
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">
              Control room
            </h1>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:mt-2 sm:grid-cols-none">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`flex min-h-12 items-center justify-center gap-3 rounded-[8px] px-3 py-3 text-left text-sm font-bold transition sm:justify-start ${
                  activeTab === tab.id
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon name={tab.icon} className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="grid min-w-0 gap-5">
          {(message || error) && (
            <div
              className={`rounded-[8px] border px-4 py-3 text-sm font-semibold ${
                error
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || message}
            </div>
          )}

          {isLoading ? (
            <div className="h-[36rem] animate-pulse rounded-[8px] bg-white/80" />
          ) : (
            <>
              {activeTab === "overview" && (
                <Overview
                  stats={stats}
                  orders={orders}
                  products={products}
                  onEditProduct={editProduct}
                />
              )}
              {activeTab === "products" && (
                <ProductsPanel
                  productForm={productForm}
                  categories={categories}
                  products={products}
                  editingProduct={editingProduct}
                  isSubmitting={isSubmitting}
                  onChange={updateProductForm}
                  onSubmit={submitProduct}
                  onCancel={resetProductForm}
                  onEdit={editProduct}
                  onDelete={deleteProduct}
                />
              )}
              {activeTab === "categories" && (
                <CategoriesPanel
                  categories={categories}
                  categoryName={categoryName}
                  editingCategory={editingCategory}
                  isSubmitting={isSubmitting}
                  onNameChange={setCategoryName}
                  onSubmit={submitCategory}
                  onCancel={() => {
                    setEditingCategory(null);
                    setCategoryName("");
                  }}
                  onEdit={editCategory}
                  onDelete={deleteCategory}
                />
              )}
              {activeTab === "orders" && (
                <OrdersPanel
                  orders={orders}
                  onStatusChange={updateOrderStatus}
                  onDelete={deleteOrder}
                />
              )}
              {activeTab === "users" && (
                <UsersPanel
                  users={users}
                  onStatusChange={updateUserStatus}
                  onDelete={deleteUser}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

const Overview = ({ stats, orders, products, onEditProduct }) => (
  <div className="grid gap-5">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="Revenue" value={formatPrice(stats.revenue)} icon="card" />
      <Stat label="Orders" value={stats.orders} icon="receipt" />
      <Stat label="Customers" value={stats.users} icon="users" />
      <Stat label="Units in stock" value={stats.stock} icon="package" />
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="panel p-5">
        <h2 className="text-xl font-black text-slate-950">Recent orders</h2>
        <div className="mt-4 grid gap-3">
          {orders.slice(0, 6).map((order) => (
            <div
              key={order._id}
              className="grid gap-2 rounded-[8px] border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="font-bold text-slate-950">
                  {order.customer.name}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDate(order.createdAt)} - {formatPrice(order.total)}
                </p>
              </div>
              <StatusPill value={order.status} />
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-slate-500">No orders yet.</p>
          )}
        </div>
      </div>
      <div className="panel p-5">
        <h2 className="text-xl font-black text-slate-950">Low stock</h2>
        <div className="mt-4 grid gap-3">
          {stats.lowStock.slice(0, 6).map((product) => (
            <div
              key={product._id}
              className="grid gap-3 rounded-[8px] border border-slate-200 bg-white p-3 sm:grid-cols-[4rem_1fr_auto] sm:items-center"
            >
              <ProductImage
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-[8px] object-cover"
              />
              <div>
                <p className="font-bold text-slate-950">{product.name}</p>
                <p className="text-sm text-slate-500">
                  {product.quantity} units left
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEditProduct(product)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 hover:border-slate-950"
                title="Edit product"
              >
                <Icon name="edit" className="h-4 w-4" />
              </button>
            </div>
          ))}
          {products.length > 0 && stats.lowStock.length === 0 && (
            <p className="text-sm text-slate-500">Inventory looks healthy.</p>
          )}
          {products.length === 0 && (
            <p className="text-sm text-slate-500">No products yet.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Stat = ({ label, value, icon }) => (
  <div className="panel p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      </div>
      <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-teal-50 text-teal-700">
        <Icon name={icon} className="h-6 w-6" />
      </span>
    </div>
  </div>
);

const CollapsibleSection = ({
  eyebrow,
  title,
  icon,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-teal-50 text-teal-700">
            <Icon name={icon} className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-bold uppercase tracking-normal text-teal-700">
              {eyebrow}
            </span>
            <span className="block truncate text-xl font-black text-slate-950">
              {title}
            </span>
          </span>
        </span>
        <Icon
          name={isOpen ? "chevronUp" : "chevronDown"}
          className="h-5 w-5 shrink-0 text-slate-500"
        />
      </button>
      {isOpen && <div className="border-t border-slate-200 p-4 sm:p-5">{children}</div>}
    </section>
  );
};

const ProductsPanel = ({
  productForm,
  categories,
  products,
  editingProduct,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}) => {
  const previewImage = productForm.image || editingProduct?.image;

  return (
  <div className="grid gap-5">
    <CollapsibleSection
      key={editingProduct?._id || "new-product"}
      eyebrow="Products"
      title={editingProduct ? "Edit product" : "Create product"}
      icon="package"
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-[8px] border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:border-slate-950"
          >
            <Icon name="x" className="h-4 w-4" />
            Cancel edit
          </button>
        )}
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Name
          <input
            required
            name="name"
            value={productForm.name}
            onChange={onChange}
            className="form-field"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Price
          <input
            required
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={productForm.price}
            onChange={onChange}
            className="form-field"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Category
          <select
            required
            name="category"
            value={productForm.category}
            onChange={onChange}
            className="form-field"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Quantity
          <input
            required
            type="number"
            min="1"
            name="quantity"
            value={productForm.quantity}
            onChange={onChange}
            className="form-field"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Sold
          <input
            type="number"
            min="0"
            name="sold"
            value={productForm.sold}
            onChange={onChange}
            className="form-field"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Shipping
          <input
            type="number"
            min="0"
            step="0.01"
            name="shipping"
            value={productForm.shipping}
            onChange={onChange}
            className="form-field"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Description
        <textarea
          required
          name="description"
          value={productForm.description}
          onChange={onChange}
          className="form-field min-h-24 resize-y"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8rem] md:items-end">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Product image URL
          <input
            type="url"
            name="image"
            value={productForm.image}
            onChange={onChange}
            className="form-field"
            placeholder="https://images.unsplash.com/..."
          />
        </label>
        <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
          <ProductImage
            src={previewImage}
            alt={productForm.name || "Product preview"}
            className="aspect-square w-full object-cover"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:bg-slate-300 sm:w-fit"
      >
        <Icon name={editingProduct ? "check" : "plus"} className="h-5 w-5" />
        {editingProduct ? "Update product" : "Create product"}
      </button>
      </form>
    </CollapsibleSection>

    <CollapsibleSection
      eyebrow={`${products.length} total`}
      title="Inventory"
      icon="dashboard"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm md:min-w-[46rem]">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="hidden px-4 py-3 md:table-cell">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="hidden px-4 py-3 sm:table-cell">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-[8px] object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-950">{product.name}</p>
                      <p className="line-clamp-2 text-xs text-slate-500">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                  {product.category?.name || "Unassigned"}
                </td>
                <td className="px-4 py-3 font-bold">
                  {formatPrice(product.price)}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {product.quantity}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 hover:border-slate-950"
                      title="Edit"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan="5">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  </div>
  );
};

const CategoriesPanel = ({
  categories,
  categoryName,
  editingCategory,
  isSubmitting,
  onNameChange,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}) => (
  <div className="grid gap-5">
    <CollapsibleSection
      eyebrow="Categories"
      title={editingCategory ? "Edit category" : "New category"}
      icon="tag"
    >
      <form
        className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end"
        onSubmit={onSubmit}
      >
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        {editingCategory ? "Edit category" : "New category"}
        <input
          required
          value={categoryName}
          onChange={(event) => onNameChange(event.target.value)}
          className="form-field"
          placeholder="Gaming Accessories"
        />
      </label>
      <div className="flex gap-2">
        {editingCategory && (
          <button
            type="button"
            onClick={onCancel}
            className="grid h-12 w-12 place-items-center rounded-[8px] border border-slate-200 text-slate-700 hover:border-slate-950"
            title="Cancel"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:bg-slate-300"
        >
          <Icon name={editingCategory ? "check" : "plus"} className="h-5 w-5" />
          {editingCategory ? "Update" : "Create"}
        </button>
      </div>
      </form>
    </CollapsibleSection>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <div key={category._id} className="panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-black text-slate-950">
                {category.name}
              </p>
              <p className="text-sm text-slate-500">{category.slug}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(category)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 hover:border-slate-950"
                title="Edit"
              >
                <Icon name="edit" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(category)}
                className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                title="Delete"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrdersPanel = ({ orders, onStatusChange, onDelete }) => (
  <CollapsibleSection
    eyebrow={`${orders.length} total`}
    title="Orders"
    icon="receipt"
  >
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left text-sm md:min-w-[54rem]">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="hidden px-4 py-3 md:table-cell">Items</th>
            <th className="hidden px-4 py-3 sm:table-cell">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="px-4 py-3">
                <p className="font-bold text-slate-950">
                  {order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDate(order.createdAt)}
                </p>
              </td>
              <td className="px-4 py-3">
                <p className="font-bold text-slate-950">{order.customer.name}</p>
                <p className="hidden text-xs text-slate-500 sm:block">
                  {order.customer.email}
                </p>
              </td>
              <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                {order.items.length} product{order.items.length === 1 ? "" : "s"}
              </td>
              <td className="hidden px-4 py-3 font-bold sm:table-cell">
                {formatPrice(order.total)}
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.status}
                  onChange={(event) => onStatusChange(order._id, event.target.value)}
                  className="form-field py-2 text-sm"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <span className="hidden lg:inline-flex">
                    <StatusPill value={order.status} />
                  </span>
                  <button
                    type="button"
                    onClick={() => onDelete(order._id)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan="6">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </CollapsibleSection>
);

const UsersPanel = ({ users, onStatusChange, onDelete }) => (
  <CollapsibleSection
    eyebrow={`${users.length} total`}
    title="Customers"
    icon="users"
  >
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-left text-sm md:min-w-[46rem]">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="hidden px-4 py-3 md:table-cell">Phone</th>
            <th className="hidden px-4 py-3 lg:table-cell">Address</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {users.map((nextUser) => (
            <tr key={nextUser._id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ProductImage
                    src={nextUser.image}
                    alt={nextUser.name}
                    className="h-11 w-11 rounded-[8px] object-cover"
                  />
                  <div>
                    <p className="font-bold text-slate-950">{nextUser.name}</p>
                    <p className="text-xs text-slate-500">{nextUser.email}</p>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                {nextUser.phone}
              </td>
              <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                {nextUser.address}
              </td>
              <td className="px-4 py-3">
                <StatusPill value={nextUser.isBanned ? "banned" : "active"} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(nextUser, nextUser.isBanned ? "unban" : "ban")
                    }
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-950"
                    title={nextUser.isBanned ? "Unban" : "Ban"}
                  >
                    <Icon
                      name={nextUser.isBanned ? "unlock" : "ban"}
                      className="h-4 w-4"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(nextUser)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan="5">
                No customers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </CollapsibleSection>
);

export default Admin;
