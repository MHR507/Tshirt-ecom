import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "designer">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Please enter email and password.");

    try {
      setLoading(true);
      await login(email, password, role);
      // Navigate based on role
      if (role === "designer") {
        navigate("/designer");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = (type: "customer" | "designer") => {
    if (type === "designer") {
      setEmail("alex@designer.com");
      setPassword("designer123");
      setRole("designer");
    } else {
      setEmail("john@customer.com");
      setPassword("customer123");
      setRole("customer");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="space-y-8">
          {/* Header */}
          <header className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-black/60">
              Sign in to continue to T-Shirt Studio
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-black/80"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-black/80"
              />
            </div>

            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">I am a:</label>
              <div className="flex gap-2">
                {(["customer", "designer"] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                      ${role === r
                        ? "bg-black text-white shadow-md"
                        : "border border-black/20 hover:bg-black hover:text-white"
                      }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-black py-2.5 text-sm font-semibold text-white
                           shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <Link
                to="/auth/register"
                className="flex-1 rounded-xl border border-black/20 py-2.5 text-sm font-semibold text-center
                           transition hover:bg-black hover:text-white"
              >
                Create account
              </Link>
            </div>
          </form>

          {/* Test accounts helper */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <p className="text-xs text-black/40 text-center">Test accounts:</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => fillTestAccount("customer")}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("designer")}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                Designer
              </button>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center">
            <Link to="/" className="text-sm text-black/60 hover:text-black transition">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
