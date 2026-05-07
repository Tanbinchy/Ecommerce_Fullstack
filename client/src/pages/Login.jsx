import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(form);
      navigate(user?.isAdmin ? "/admin" : "/account");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title="Login" />
      <section className="section-shell grid min-h-[calc(100vh-12rem)] place-items-center py-10">
        <form
          onSubmit={handleSubmit}
          className="panel grid w-full max-w-md gap-5 p-6 sm:p-8"
        >
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-slate-950 text-white">
              <Icon name="user" className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-3xl font-black text-slate-950">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage your account or open the admin panel.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              className="form-field"
              placeholder="user@demo.com"
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
          {error && (
            <div className="rounded-[8px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:bg-slate-300"
          >
            <Icon name="check" className="h-5 w-5" />
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-950"
          >
            <Icon name="admin" className="h-5 w-5" />
            Admin login
          </Link>
          <p className="text-center text-sm text-slate-500">
            New customer?{" "}
            <Link className="font-bold text-teal-700" to="/register">
              Create account
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Login;
