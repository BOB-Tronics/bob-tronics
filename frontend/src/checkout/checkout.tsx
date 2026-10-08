"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import "./checkout.css";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  createAccount: boolean;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  phone: "",
  createAccount: true,
};

const steps = ["Customer Details", "Delivery", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [deliveryLocation, setDeliveryLocation] = useState("Kigali, Rwanda");
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);

  const subtotal = 900000;
  const deliveryFee = 30000;
  const total = subtotal + deliveryFee;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    } as FormState));
  };

  const handleCheckboxChange = () => {
    setForm((previous) => ({
      ...previous,
      createAccount: !previous.createAccount,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      return;
    }
    router.push("/orders");
  };

  const saveDeliveryDetails = () => {
    setIsEditingDelivery(false);
  };

  return (
    <div className="checkout-page">
     

      <div className="support-strip">
        <span>Genuine tech. Expert support. Delivered.</span>
      </div>

      <Navbar />

      <main className="checkout-shell">
        <div className="checkout-breadcrumb"><Link href="/">Home</Link> / <Link href="/checkout">Shop</Link> / Checkout</div>
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">A few simple steps to your next upgrade</p>

        <div className="checkout-main">
          <form className="checkout-form-panel" onSubmit={handleSubmit}>
            <div className="checkout-stepper" aria-label="Checkout steps">
              {steps.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  className={`step ${index === activeStep ? "is-active" : ""} ${index < activeStep ? "is-complete" : ""}`}
                  onClick={() => setActiveStep(index)}
                  aria-current={index === activeStep ? "step" : undefined}
                  disabled={index > activeStep}
                >
                  {step}
                </button>
              ))}
            </div>

            <div className="form-section-title">{steps[activeStep]}</div>
            <div className="login-link">Already have an account? <Link href="/orders">Login</Link></div>

            <div className="field-grid">
              <label className="field-wrap">
                <span className="field-label">First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  autoComplete="given-name"
                />
              </label>

              <label className="field-wrap">
                <span className="field-label">Last Name</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  autoComplete="family-name"
                />
              </label>

              <label className="field-wrap full-width">
                <span className="field-label">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  autoComplete="email"
                />
              </label>

              <label className="field-wrap full-width select-wrap">
                <span className="field-label">Country</span>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleInputChange}
                  required
                  autoComplete="country-name"
                >
                  <option value="">Select country</option>
                  <option value="rwanda">Rwanda</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="ghana">Ghana</option>
                  <option value="kenya">Kenya</option>
                  <option value="south-africa">South Africa</option>
                </select>
                <FiChevronDown className="select-icon" />
              </label>

              <label className="field-wrap full-width">
                <span className="field-label">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  autoComplete="tel"
                />
              </label>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.createAccount}
                onChange={handleCheckboxChange}
              />
              <span className="custom-checkbox">
                {form.createAccount ? <FiCheck /> : null}
              </span>
              <span>Create an account to track your order</span>
            </label>

            <button type="submit" className="primary-button">
              Continue to Payment
            </button>
          </form>

          <aside className="checkout-summary-panel">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="product-row">
                <div className="product-image" aria-hidden="true">
                  <div className="screen" />
                  <div className="keyboard" />
                </div>
                <div className="product-meta">
                  <p>MacBook Air 13&quot; M3</p>
                  <p>Midnight-8GB/256GB</p>
                  <p className="price">RWF 900,000</p>
                </div>
              </div>

              <div className="summary-list">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>RWF {subtotal.toLocaleString("en-US")}</strong>
                </div>
                <div className="summary-row">
                  <span>Delivery RWF</span>
                  <strong>RWF {deliveryFee.toLocaleString("en-US")}</strong>
                </div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <strong>RWF {total.toLocaleString("en-US")}</strong>
                </div>
              </div>
            </div>

            <div className="delivery-card">
              {isEditingDelivery ? (
                <div className="delivery-editor">
                  <label htmlFor="delivery-location">Delivering to</label>
                  <input
                    id="delivery-location"
                    type="text"
                    value={deliveryLocation}
                    onChange={(event) => setDeliveryLocation(event.target.value)}
                    placeholder="Enter delivery address"
                  />
                  <button type="button" className="save-delivery-button" onClick={saveDeliveryDetails}>
                    Save changes
                  </button>
                </div>
              ) : (
                <div className="delivery-display">
                  <span>Delivering to</span>
                  <strong>{deliveryLocation}</strong>
                </div>
              )}
            </div>

            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditingDelivery((previous) => !previous)}
              aria-expanded={isEditingDelivery}
            >
              {isEditingDelivery ? "Cancel edit" : "Edit delivery details"}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
