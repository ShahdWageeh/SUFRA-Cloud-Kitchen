"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faMessage,
  faPaperPlane,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { contactService } from "@/services";

const helpItems = [
  {
    icon: faQuestionCircle,
    title: "How do I join as a Chef?",
    text: "Apply online, share your food story, and our team will guide you through kitchen verification.",
  },
  {
    icon: faMessage,
    title: "Is the food safety guaranteed?",
    text: "We review chef profiles, kitchen standards, and customer feedback to keep trust at the center.",
  },
  {
    icon: faClock,
    title: "What is your response time?",
    text: "Most messages receive a response within one business day from our community support team.",
  },
  {
    icon: faLocationDot,
    title: "Can I visit your office?",
    text: "Visits are available by appointment at ITI Cairo University for partners and community members.",
  },
];

export default function ContactPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!user) {
    //   toast.error("Please login to send a message");
    //   router.push("/login");
    //   return;
    // }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const result = await contactService.submitMessage(formData);
      if (result.success) {
        toast.success("Message sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send message";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background text-text-primary">
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-t-xl">
          <div className="relative h-52 sm:h-64 lg:h-72">
            <Image
              src="/contact.jpg"
              alt="Fresh ingredients on a kitchen table"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/35" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/90">
              Questions, partnerships, or support? Our community team is here to
              help.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="-mt-12 grid gap-4 lg:z-10">
          <article className="rounded-lg bg-white p-5 shadow-[0_12px_32px_rgba(27,28,28,0.12)] ring-1 ring-primary/10">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faMessage} className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold">Chat with Us</h2>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Need help navigating Sufra or managing an order? Send us a
                  message.
                </p>
                <a
                  href="tel:+201000000000"
                  className="mt-2 inline-block text-sm font-bold text-primary"
                >
                  +20 100 000 0000
                </a>
              </div>
            </div>
          </article>

          <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-primary/10">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold">Email Support</h2>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Questions about chef partnerships, feedback, or general
                  inquiries.
                </p>
                <a
                  href="mailto:hello@Sufra.com"
                  className="mt-2 inline-block text-sm font-bold text-primary"
                >
                  hello@sufra.com
                </a>
              </div>
            </div>
          </article>

          <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-primary/10">
            <h2 className="text-lg font-bold">Join the Community</h2>
            <div className="mt-4 flex gap-3">
              {[faFacebookF, faInstagram, faXTwitter, faLinkedinIn].map(
                (icon, index) => (
                  <a
                    key={index}
                    href="#"
                    aria-label="Sufra social channel"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-text-secondary transition hover:bg-primary hover:text-white"
                  >
                    <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />
                  </a>
                ),
              )}
            </div>
          </article>

          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-primary/10">
            <iframe
              title="ITI Cairo University map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.2920376382403!2d31.19913617415903!3d30.028478519329468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145847bb846e3799%3A0x548589ae5d24cbd0!2sITI%20Cairo%20University!5e0!3m2!1sen!2seg!4v1780586818446!5m2!1sen!2seg"
              width="800"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="-mt-12 grid gap-4 rounded-lg bg-white p-5 shadow-[0_12px_32px_rgba(27,28,28,0.12)] ring-1 ring-primary/10 sm:grid-cols-2 lg:z-10"
        >
          <label className="space-y-2">
            <span className="text-xs font-bold text-text-secondary">
              Full Name
            </span>
            <input
              type="text"
              name="fullName"
              placeholder="Sarah Chen"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-md border border-primary/15 bg-background px-2 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold text-text-secondary">
              Email Address
            </span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-md border border-primary/15 bg-background px-2 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-bold text-text-secondary">
              Subject
            </span>
            <input
              type="text"
              name="subject"
              placeholder="Subject of your message"
              value={formData.subject}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-md border border-primary/15 bg-background px-2 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-bold text-text-secondary">
              Message
            </span>
            <textarea
              name="message"
              rows={7}
              placeholder="How can we help you today?"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full resize-none rounded-md border border-primary/15 bg-background px-2 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white transition hover:bg-primary-container disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
              <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" />
            </button>
          </div>
        </form>
      </section>

      <section className="bg-secondary-container">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Quick Help</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            Find answers to the most common questions from our community.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {helpItems.map((item) => (
              <article
                key={item.title}
                className="rounded-lg bg-white p-5 text-left shadow-sm ring-1 ring-primary/10"
              >
                <div className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={item.icon} className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      {item.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
