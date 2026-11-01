import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  "Flood relief",
  "Earthquake relief",
  "Education",
  "Food & nutrition",
  "Healthcare",
  "Child welfare",
  "Women empowerment",
  "Other",
];

const orgTypes = ["NGO / Trust", "Registered society", "Section 8 company", "Other"];

const idTypes = [
  "Aadhaar card",
  "PAN card",
  "Passport",
  "Voter ID",
  "Driving licence",
];

const MAX_WORDS = 100;
const MIN_WORDS = 20;
const MAX_PHOTOS = 5;
const MAX_SIZE_MB = 5;

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const emptyForm = {
  username: "",
  password: "",
  orgName: "",
  orgType: orgTypes[0],
  regNumber: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  orgAbout: "",
  title: "",
  category: categories[0],
  goal: "",
  endDate: "",
  location: "",
  cause: "",
  idType: idTypes[0],
  agree: false,
};

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

function Card({ number, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-xl font-bold text-emerald-950">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

// Single document upload (PDF or image) with file name and remove button
function DocUpload({ label, required, hint, file, onPick, onError }) {
  const handle = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    const okType =
      picked.type === "application/pdf" || picked.type.startsWith("image/");
    if (!okType) {
      onError("Only PDF or image files are allowed for documents.");
      return;
    }
    if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
      onError(`Each document must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }
    onError("");
    onPick(picked);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-xl" aria-hidden="true">
              {file.type === "application/pdf" ? "📄" : "🖼️"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-emerald-900">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPick(null)}
            aria-label={`Remove ${label}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-red-600 hover:text-white"
          >
            ✕
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handle}
          className="block w-full cursor-pointer rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-3 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-emerald-800"
        />
      )}

      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </div>
  );
}

export default function CreateCampaign() {
  const [form, setForm] = useState(emptyForm);
  const [photos, setPhotos] = useState([]); // [{ file, url }]
  const [certificate, setCertificate] = useState(null);
  const [govtProof, setGovtProof] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null); // reference id
  const topRef = useRef(null);

  const words = countWords(form.cause);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
  };

  const handlePhotos = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";

    const valid = [];
    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files can be added as photos.");
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each photo must be smaller than ${MAX_SIZE_MB} MB.`);
        continue;
      }
      valid.push({ file, url: URL.createObjectURL(file) });
    }

    setPhotos((prev) => {
      const merged = [...prev, ...valid];
      if (merged.length > MAX_PHOTOS) {
        merged.slice(MAX_PHOTOS).forEach((p) => URL.revokeObjectURL(p.url));
        setError(`You can add up to ${MAX_PHOTOS} photos.`);
        return merged.slice(0, MAX_PHOTOS);
      }
      return merged;
    });
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    if (!form.username.trim() || !form.password)
      return "Please enter your username and password.";
    if (!form.orgName.trim()) return "Please enter your organisation name.";
    if (!form.regNumber.trim()) return "Please enter your registration number.";
    if (!form.contactPerson.trim()) return "Please enter the contact person's name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
    if (!/^\d{10}$/.test(form.phone)) return "Please enter a valid 10-digit phone number.";
    if (countWords(form.orgAbout) < 10)
      return "Please tell us a little more about your organisation.";
    if (!form.title.trim()) return "Please enter a campaign title.";
    if (!form.goal || Number(form.goal) <= 0) return "Please enter a valid funding goal.";
    if (!form.endDate) return "Please choose a campaign end date.";
    if (!form.location.trim()) return "Please enter the campaign location.";
    if (words < MIN_WORDS)
      return `Please describe the cause in at least ${MIN_WORDS} words.`;
    if (words > MAX_WORDS)
      return `The cause description can be at most ${MAX_WORDS} words.`;
    if (photos.length === 0) return "Please add at least one photo.";
    if (!govtProof) return "Please upload the proof of government authorisation.";
    if (!idProof) return "Please upload the proof of identity.";
    if (!form.agree) return "Please confirm the declaration.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    // ---- BACKEND: send everything to your friend's API here ----
    // const data = new FormData();
    // Object.entries(form).forEach(([k, v]) => data.append(k, v));
    // photos.forEach((p) => data.append("photos", p.file));
    // data.append("govtProof", govtProof);
    // data.append("idProof", idProof);
    // if (certificate) data.append("certificate", certificate);
    // fetch("http://localhost:5000/api/campaigns", { method: "POST", body: data });
    // The backend should verify username + password, store the ID documents
    // securely (private storage, not public), and save status = "pending".
    // -------------------------------------------------------------
    console.log("Campaign submitted:", {
      ...form,
      password: undefined, // never log passwords
      photos: photos.length,
      govtProof: govtProof.name,
      idProof: idProof.name,
    });

    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setSubmitted("TC-" + Date.now().toString().slice(-6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- After submit: Pending status ---------- */
  if (submitted) {
    const steps = [
      { label: "Submitted", state: "done" },
      { label: "Under verification", state: "current" },
      { label: "Campaign live", state: "todo" },
    ];

    return (
      <main className="min-h-[70vh] bg-emerald-50/60 px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl">
            ⏳
          </div>

          <span className="mt-6 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-amber-800">
            Status: Pending
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-emerald-950">
            Campaign submitted for verification
          </h1>
          <p className="mt-3 leading-7 text-gray-600">
            Thank you, {form.orgName}. Our team will verify your details and
            documents. Your campaign will go live as soon as it is approved.
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-left text-sm">
            <p className="text-gray-500">
              Reference ID:{" "}
              <span className="font-bold text-emerald-900">{submitted}</span>
            </p>
            <p className="mt-1 text-gray-500">
              Campaign:{" "}
              <span className="font-semibold text-emerald-900">{form.title}</span>
            </p>
          </div>

          <ol className="mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm">
            {steps.map((step, i) => (
              <li key={step.label} className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                    step.state === "done"
                      ? "bg-emerald-600 text-white"
                      : step.state === "current"
                      ? "bg-amber-400 text-amber-950"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.state === "done" ? "✓" : i + 1}
                </span>
                <span
                  className={
                    step.state === "todo" ? "text-gray-400" : "font-semibold text-gray-700"
                  }
                >
                  {step.label}
                </span>
                {i < steps.length - 1 && <span className="mx-1 text-gray-300">—</span>}
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              Back to home
            </Link>
            <Link
              to="/campaigns"
              className="rounded-xl border-2 border-emerald-700 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Browse campaigns
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ---------- The form ---------- */
  return (
    <main
      ref={topRef}
      className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 py-12 sm:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            START A CAMPAIGN
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">
            Create a Campaign
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Fill in the details below. Every campaign is verified by our team
            before it goes live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* 1. Account */}
          <Card
            number="1"
            title="Your account"
            subtitle="Login with the account you registered with."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Username" required>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  autoComplete="username"
                  className={inputClass}
                />
              </Field>

              <Field label="Password" required>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
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
              </Field>
            </div>
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
                Register as a Campaign Creator
              </Link>
            </p>
          </Card>

          {/* 2. Organisation */}
          <Card
            number="2"
            title="About your organisation"
            subtitle="Tell us who is running this campaign."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Organisation name" required>
                <input
                  name="orgName"
                  value={form.orgName}
                  onChange={handleChange}
                  placeholder="e.g. Simile Foundation"
                  className={inputClass}
                />
              </Field>

              <Field label="Organisation type" required>
                <select
                  name="orgType"
                  value={form.orgType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {orgTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <Field label="Registration number" required hint="NGO / trust registration ID">
                <input
                  name="regNumber"
                  value={form.regNumber}
                  onChange={handleChange}
                  placeholder="Registration number"
                  className={inputClass}
                />
              </Field>

              <Field label="Contact person" required>
                <input
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={inputClass}
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@organisation.org"
                  className={inputClass}
                />
              </Field>

              <Field label="Phone number" required>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  name="phone"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value.replace(/\D/g, "") });
                    setError("");
                  }}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Website (optional)">
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://"
                className={inputClass}
              />
            </Field>

            <Field label="About your organisation" required hint="What work does your organisation do?">
              <textarea
                name="orgAbout"
                value={form.orgAbout}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your organisation, its mission and past work."
                className={inputClass}
              />
            </Field>
          </Card>

          {/* 3. Campaign */}
          <Card
            number="3"
            title="Campaign details"
            subtitle="What are you raising funds for?"
          >
            <Field label="Campaign title" required>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Help flood-affected families rebuild their lives"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" required>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Funding goal (₹)" required>
                <input
                  type="number"
                  min="1"
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  placeholder="e.g. 500000"
                  className={inputClass}
                />
              </Field>

              <Field label="Campaign end date" required>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Location" required>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Describe your cause" required>
              <textarea
                name="cause"
                value={form.cause}
                onChange={handleChange}
                rows={5}
                placeholder="Explain the cause, who will benefit and how the funds will be used."
                className={inputClass}
              />
              <span
                className={`mt-1 block text-right text-xs font-semibold ${
                  words > MAX_WORDS ? "text-red-600" : "text-gray-500"
                }`}
              >
                {words} / {MAX_WORDS} words
              </span>
            </Field>
          </Card>

          {/* 4. Photos and documents */}
          <Card
            number="4"
            title="Photos and documents"
            subtitle={`Up to ${MAX_PHOTOS} photos. Documents: PDF or image, ${MAX_SIZE_MB} MB each.`}
          >
            <Field label="Campaign photos" required>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotos}
                className="block w-full cursor-pointer rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-emerald-800"
              />
            </Field>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((p, i) => (
                  <div key={p.url} className="group relative overflow-hidden rounded-xl">
                    <img src={p.url} alt={`Campaign photo ${i + 1}`} className="h-28 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label="Remove photo"
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <DocUpload
              label="Registration certificate (optional)"
              hint="This helps us verify your organisation faster."
              file={certificate}
              onPick={setCertificate}
              onError={setError}
            />

            {/* Verification documents */}
            <div className="mt-2 border-t border-emerald-100 pt-6">
              <h3 className="text-lg font-bold text-emerald-950">
                Verification documents
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Required to verify your organisation and the person running
                this campaign. These documents are seen only by our
                verification team and are never shown publicly.
              </p>

              <div className="mt-5 space-y-5">
                <DocUpload
                  label="Proof of government authorisation"
                  required
                  hint="Document that shows your organisation is authorised by the government, for example the registration certificate, 12A / 80G approval or FCRA registration."
                  file={govtProof}
                  onPick={setGovtProof}
                  onError={setError}
                />

                <Field label="Type of identity proof" required>
                  <select
                    name="idType"
                    value={form.idType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {idTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <DocUpload
                  label="Proof of identity"
                  required
                  hint="A government ID of the contact person named above, matching the type selected."
                  file={idProof}
                  onPick={setIdProof}
                  onError={setError}
                />
              </div>
            </div>
          </Card>

          {/* Declaration + submit */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mt-1 h-5 w-5 accent-emerald-700"
              />
              <span className="text-sm leading-6 text-gray-700">
                I confirm that the information and documents given above are
                true, and I understand that this campaign will stay in{" "}
                <strong>Pending</strong> status until it is verified by the
                TrustChain team.
              </span>
            </label>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-emerald-700 py-4 text-lg font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Submit for verification
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}