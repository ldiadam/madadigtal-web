"use client";

import { FormEvent, useId, useState } from "react";

type FormStatus = "idle" | "loading" | "error" | "success";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name")?.toString().trim() ?? "",
      company: formData.get("company")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      budgetRange: formData.get("budget")?.toString().trim() ?? "",
      message: formData.get("message")?.toString().trim() ?? "",
    };

    if (!payload.email) {
      setStatus("error");
      setErrorMessage("Email is required so we can get back to you.");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage(null);

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      console.error("Failed to submit lead", error);
      setStatus("error");
      setErrorMessage("We couldn't save your message. Please try again or email hello@madadigital.id.");
    }
  }

  return (
    <form
      aria-describedby={`${formId}-form-status`}
      className="w-full max-w-xl space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-lg shadow-slate-950/30"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-left text-sm font-medium text-white/80">
          Name
          <input
            name="name"
            type="text"
            placeholder="Your name"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          />
        </label>
        <label className="flex flex-col gap-2 text-left text-sm font-medium text-white/80">
          Company
          <input
            name="company"
            type="text"
            placeholder="Company or team"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-left text-sm font-medium text-white/80">
        Email<span className="text-emerald-400">*</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        />
      </label>

      <label className="flex flex-col gap-2 text-left text-sm font-medium text-white/80">
        Project overview
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about the product, timeline, and success metrics."
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        />
      </label>

      <label className="flex flex-col gap-2 text-left text-sm font-medium text-white/80">
        Estimated budget
        <select
          name="budget"
          defaultValue=""
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        >
          <option value="" disabled>
            Select a range
          </option>
          <option value="Under $10k">Under $10k</option>
          <option value="$10k - $30k">$10k - $30k</option>
          <option value="$30k - $75k">$30k - $75k</option>
          <option value="$75k+">$75k+</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending..." : "Send project details"}
      </button>

      <p id={`${formId}-form-status`} className="text-xs text-white/60">
        {status === "success" && "Thanks! We'll reach out within one business day."}
        {status === "error" && errorMessage}
        {status === "loading" && "Sending your message..."}
        {status === "idle" && "We respond within one business day with next steps."}
      </p>
    </form>
  );
}
