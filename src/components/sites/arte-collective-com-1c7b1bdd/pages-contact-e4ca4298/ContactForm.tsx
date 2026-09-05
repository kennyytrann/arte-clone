"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  phone: string;
  website: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  website: "",
  message: "",
};

type FieldName = "name" | "email" | "phone";

const REQUIRED_FIELDS: FieldName[] = ["name", "email", "phone"];

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FieldName, boolean>>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: Partial<Record<FieldName, boolean>> = {};
    for (const field of REQUIRED_FIELDS) {
      if (!values[field].trim()) {
        nextErrors[field] = true;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // No real backend — out of scope. Log the payload and show a success state.
    console.log("Contact form submitted:", values);
    setSubmitted(true);
  }

  const underlineClass = (field: string, hasError?: boolean) =>
    cn(
      "w-full border-0 border-b bg-transparent pt-[10px] pb-[10px] text-[15px] text-arte-text placeholder:text-arte-text-muted focus:outline-none",
      hasError
        ? "border-red-500"
        : focused === field
          ? "border-arte-text"
          : "border-[#e5e5e5]",
    );

  if (submitted) {
    return (
      <div className="mx-auto max-w-[560px] px-4 py-16 text-center">
        <span className="mb-4 inline-block rounded-[20px] bg-arte-orange/15 px-3 py-[6px] font-mono text-[11px] font-medium uppercase tracking-wide text-arte-orange">
          Contact
        </span>
        <h2 className="mb-3 font-sans text-[24px] font-medium text-arte-text">
          Message sent
        </h2>
        <p className="text-[13px] leading-relaxed text-arte-text-muted">
          Thanks for reaching out — we&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 py-16 text-center sm:px-0">
      <span className="mb-4 inline-block rounded-[20px] bg-arte-orange/15 px-3 py-[6px] font-mono text-[11px] font-medium uppercase tracking-wide text-arte-orange">
        Contact
      </span>
      <h2 className="mb-3 font-sans text-[24px] font-medium text-arte-text">
        Get in touch
      </h2>
      <p className="mx-auto mb-10 max-w-[460px] text-[13px] leading-relaxed text-arte-text-muted">
        For priority support on an existing order, please reply directly to your
        confirmation email. For all other inquiries, feel free to use the form
        below.
      </p>

      <form onSubmit={handleSubmit} noValidate className="text-left">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              placeholder="Your Name*"
              aria-label="Your Name"
              aria-required="true"
              className={underlineClass("name", errors.name)}
            />
            {errors.name ? (
              <p className="mt-1 text-[11px] text-red-500">Your name is required.</p>
            ) : null}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="E-mail address*"
              aria-label="E-mail address"
              aria-required="true"
              className={underlineClass("email", errors.email)}
            />
            {errors.email ? (
              <p className="mt-1 text-[11px] text-red-500">Your email is required.</p>
            ) : null}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused(null)}
              placeholder="Your Phone Number*"
              aria-label="Your Phone Number"
              aria-required="true"
              className={underlineClass("phone", errors.phone)}
            />
            {errors.phone ? (
              <p className="mt-1 text-[11px] text-red-500">
                Your phone number is required.
              </p>
            ) : null}
          </div>

          <div>
            <input
              type="text"
              name="website"
              value={values.website}
              onChange={(e) => update("website", e.target.value)}
              onFocus={() => setFocused("website")}
              onBlur={() => setFocused(null)}
              placeholder="Website"
              aria-label="Website"
              className={underlineClass("website")}
            />
          </div>

          <div className="sm:col-span-2">
            <textarea
              name="message"
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
              placeholder="Your Message"
              aria-label="Your Message"
              rows={1}
              className={cn(underlineClass("message"), "resize-none")}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mx-auto mt-10 block h-[50px] bg-arte-text px-10 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Send a Message
        </button>
      </form>
    </div>
  );
}
