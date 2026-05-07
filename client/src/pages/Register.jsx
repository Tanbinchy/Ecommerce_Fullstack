import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, verifyAccount } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    image: "",
  });
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const accountPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        address: form.address.trim(),
        image: form.image.trim(),
      };

      if (!accountPayload.image) delete accountPayload.image;

      const payload = await register(accountPayload);
      setToken(payload.token || "");
      setMessage("Account created. Verify with the token sent by the backend.");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await verifyAccount(token);
      setMessage("Account verified. You can now sign in.");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title="Register" />
      <section className="section-shell grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div className="grid content-center gap-5">
          <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-slate-950 text-white">
            <Icon name="user" className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-950">
            Create your store account
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Registration uses your existing backend email-verification flow. In
            development, the returned token is shown here so you can activate
            the account quickly.
          </p>
        </div>

        <div className="grid gap-5">
          <form className="panel grid gap-4 p-5 sm:p-7" onSubmit={handleRegister}>
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
                Password
                <input
                  required
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  className="form-field"
                  placeholder="Strong@123"
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
            </div>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Address
              <textarea
                required
                name="address"
                value={form.address}
                onChange={updateField}
                className="form-field min-h-24 resize-y"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:bg-slate-300"
            >
              <Icon name="check" className="h-5 w-5" />
              {isSubmitting ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="panel grid gap-4 p-5 sm:p-7">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Verification token
              <textarea
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="form-field min-h-24 resize-y"
                placeholder="Paste your token"
              />
            </label>
            <button
              type="button"
              onClick={handleVerify}
              disabled={!token || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-950 disabled:bg-slate-300"
            >
              <Icon name="check" className="h-5 w-5" />
              Verify account
            </button>
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
            <p className="text-center text-sm text-slate-500">
              Already verified?{" "}
              <Link className="font-bold text-teal-700" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
