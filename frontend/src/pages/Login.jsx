import { useState } from "react";

const roles = [
  { id: "donor", label: "Donor", icon: "💚", hint: "Donate to verified campaigns" },
  { id: "creator", label: "Campaign Creator", icon: "📣", hint: "Start and manage campaigns" },
];

const emptyForm = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  organisation: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

export default function Login() {
  const [role, setRole] = useState("donor");
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Mobile OTP
  const [otpOpen, setOtpOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const isLogin = mode === "login";
  const roleLabel = role === "donor" ? "Donor" : "Campaign Creator";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.username.trim() || !form.password) {
      setError("Please enter your username and password.");
      return;
    }

    if (!isLogin) {
      if (!form.fullName.trim() || !form.email.trim()) {
        setError("Please fill in your name and email.");
        return;
      }
      if (role === "creator" && !form.organisation.trim()) {
        setError("Please enter your organisation name.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    // ---- BACKEND: replace this block with your friend's API call ----
    // Example:
    // fetch("http://localhost:5000/api/auth/" + mode, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ role, ...form }),
    // });
    console.log("Submit:", { role, mode, ...form });
    setMessage(`${isLogin ? "Login" : "Registration"} details ready for ${roleLabel}.`);
    // ------------------------------------------------------------------
  };

  const handleGoogle = () => {
    // BACKEND: start Google sign-in here (Firebase Auth or backend OAuth)
    console.log("Google sign-in as", role);
  };

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    // BACKEND: request an OTP for this number
    console.log("Send OTP to", phone);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setError("");
    // BACKEND: verify the OTP here
    console.log("Verify OTP", { phone, otp, role });
    setMessage("OTP submitted for verification.");
  };

  return (
    <main className="min-h-[85vh] bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 py-10 sm:px-8 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-5">

        {/* Left panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-950 p-10 text-white lg:col-span-2 lg:flex">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative" translate="no">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl">
                🌿
              </span>
              <span className="text-2xl font-bold">TrustChain</span>
            </div>
          </div>

          <div className="relative">
            <h2 className="text-3xl font-extrabold leading-tight">
              {isLogin ? "Welcome back." : "Join TrustChain."}
              <br />
              Give with trust.
            </h2>
            <p className="mt-4 leading-7 text-emerald-100/85">
              Every donation is recorded on the blockchain, so you can see
              exactly where your support goes.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-emerald-50">
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">✓</span>
                Verified NGOs and campaigns
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">✓</span>
                Tamper-proof donation records
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">✓</span>
                Complete transparency
              </li>
            </ul>
          </div>

          <p className="relative text-xs text-emerald-100/60">© TrustChain</p>
        </aside>

        {/* Right panel: form */}
        <section className="p-6 sm:p-10 lg:col-span-3">
          <div className="mx-auto max-w-md">
            <h1 className="text-3xl font-extrabold text-emerald-950">
              {isLogin ? "Login to your account" : "Create your account"}
            </h1>
            <p className="mt-2 text-gray-500">
              {isLogin
                ? "Choose how you want to continue."
                : "Register to start giving or raising funds."}
            </p>

            {/* Role selector */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  aria-pressed={role === r.id}
                  className={`rounded-2xl border-2 p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-md ${
                    role === r.id
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <p
                    className={`mt-2 font-bold ${
                      role === r.id ? "text-emerald-800" : "text-gray-800"
                    }`}
                  >
                    {r.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{r.hint}</p>
                </button>
              ))}
            </div>

            {/* Login / Register switch */}
            <div className="mt-6 flex rounded-full bg-gray-100 p-1">
              {[
                { id: "login", label: "Login" },
                { id: "register", label: "Register" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => switchMode(m.id)}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${
                    mode === m.id
                      ? "bg-emerald-700 text-white shadow"
                      : "text-gray-600 hover:text-emerald-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Full name"
                    autoComplete="name"
                    className={inputClass}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    autoComplete="email"
                    className={inputClass}
                  />
                  {role === "creator" && (
                    <input
                      type="text"
                      name="organisation"
                      value={form.organisation}
                      onChange={handleChange}
                      placeholder="NGO / Organisation name"
                      className={inputClass}
                    />
                  )}
                </>
              )}

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                autoComplete="username"
                className={inputClass}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {!isLogin && (
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className={inputClass}
                />
              )}

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}
              {message && (
                <p className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-700 py-3.5 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {isLogin ? "Login" : "Register"} as {roleLabel}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Or sign up with two-factor authentication
              </span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google + Mobile OTP */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleGoogle}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md"
              >
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.300 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.300-.1-2.700-.4-3.900z" />
                  <path fill="#FF3D00" d="M6.300 14.700l6.600 4.800C14.700 15.100 19 12 24 12c3.100 0 5.800 1.200 8 3l5.700-5.700C34 6.100 29.300 4 24 4 16.300 4 9.700 8.300 6.300 14.700z" />
                  <path fill="#4CAF50" d="M24 44c5.200 0 9.900-2 13.400-5.200l-6.200-5.200C29.200 35.100 26.700 36 24 36c-5.200 0-9.600-3.300-11.300-8l-6.500 5C9.500 39.600 16.200 44 24 44z" />
                  <path fill="#1976D2" d="M43.600 20.100H42V20H24v8h11.300c-.8 2.200-2.200 4.100-4.100 5.600l6.200 5.200C37 39.200 44 34 44 24c0-1.300-.1-2.700-.4-3.900z" />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpOpen(!otpOpen);
                  setError("");
                }}
                aria-expanded={otpOpen}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                  otpOpen
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:text-emerald-700"
                }`}
              >
                <span aria-hidden="true">📱</span>
                Mobile OTP
              </button>
            </div>

            {/* OTP box */}
            {otpOpen && (
              <div className="mt-4 space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex gap-2">
                  <span className="flex items-center rounded-xl border border-gray-200 bg-white px-3 text-gray-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      setError("");
                    }}
                    placeholder="Mobile number"
                    className={inputClass}
                  />
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full rounded-xl bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Send OTP
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        setError("");
                      }}
                      placeholder="Enter 6-digit OTP"
                      className={`${inputClass} text-center tracking-[0.5em]`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full rounded-xl bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Verify & Continue
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full text-sm font-medium text-emerald-700 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </div>
            )}

            <p className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? "New to TrustChain?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(isLogin ? "register" : "login")}
                className="font-semibold text-emerald-700 hover:underline"
              >
                {isLogin ? "Register here" : "Login here"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}