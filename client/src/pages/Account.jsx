import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import ProductImage from "../components/ProductImage";
import { useAuth } from "../context/AuthContext";
import { getEditableImageUrl } from "../utils/images";

const Account = () => {
  const { user, isCheckingSession, logout, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      image: getEditableImageUrl(user.image),
    });
  }, [user]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const profilePayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        image: form.image.trim(),
      };

      if (!profilePayload.image) delete profilePayload.image;

      await updateProfile(user._id, profilePayload);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <section className="section-shell py-16">
        <div className="h-72 animate-pulse rounded-[8px] bg-white/80" />
      </section>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <PageTitle title="Account" />
      <section className="section-shell grid gap-8 py-10 lg:grid-cols-[22rem_1fr] lg:py-16">
        <aside className="panel h-fit p-6">
          <ProductImage
            src={user.image}
            alt={user.name}
            className="h-28 w-28 rounded-[8px] object-cover"
          />
          <h1 className="mt-5 text-3xl font-black text-slate-950">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {user.isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-sm font-bold text-white"
              >
                <Icon name="admin" className="h-4 w-4" />
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-slate-950"
            >
              <Icon name="logout" className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="grid gap-5">
          <form className="panel grid gap-5 p-6" onSubmit={handleProfileUpdate}>
            <p className="text-sm font-bold uppercase tracking-normal text-teal-700">
              Profile
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Update account details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Name
                <input
                  required
                  name="name"
                  value={form.name}
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
              <label className="grid gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
                Address
                <textarea
                  required
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  className="form-field min-h-24 resize-y"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
                Profile image URL
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={updateField}
                  className="form-field"
                  placeholder="https://images.unsplash.com/..."
                />
              </label>
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">Email</p>
                <p className="mt-1 break-all font-semibold text-slate-950">{user.email}</p>
              </div>
              <div className="rounded-[8px] bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Status
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {user.isBanned ? "Banned" : "Active"}
                </p>
              </div>
            </div>
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
              className="inline-flex w-fit items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:bg-slate-300"
            >
              <Icon name="check" className="h-5 w-5" />
              {isSubmitting ? "Saving..." : "Save profile"}
            </button>
          </form>
          <div className="panel p-6">
            <h2 className="text-2xl font-black text-slate-950">
              Continue shopping
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your cart is saved in this browser so you can return to checkout
              whenever you are ready.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Browse products
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
