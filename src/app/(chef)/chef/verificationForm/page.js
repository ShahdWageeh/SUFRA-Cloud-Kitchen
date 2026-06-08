"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCertificate,
  faHeartPulse,
  faUtensils,
  faFileUpload,
  faStethoscope,
  faShield,
  faImage,
  faCheckCircle,
  faAward,
  faGraduationCap,
  faSpinner,
  faArrowRight,
  faHome,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import UploadZone from "@/components/ui/UploadZone";

export default function VerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      alert("Please confirm the information accuracy before submitting.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        "Verification request submitted successfully! Redirecting to dashboard...",
      );
    }, 2000);
  };

  const handleFileChange = (e, fieldName) => {
    if (e.target.files.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }
  };

  return (
    <main className="bg-[url(/registerBackground.jpg)] bg-center bg-cover bg-no-repeat pt-4 pb-20 px-4 sm:px-6 bg-(--color-background) min-h-screen font-(--font-display)">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="font-headline-lg text-3xl md:text-5xl text-text-primary mb-3">
            Chef Verification
          </h1>
          <p className="font-body-lg text-lg text-text-secondary max-w-xl mx-auto">
            Complete your verification to start selling homemade meals on
            Matbakhna. Help us maintain our community&apos;s trust and safety
            standards.
          </p>
        </div>

        {/* Form Container */}
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          id="verificationForm"
        >
          {/* Personal Information */}
          <section className="bg-(--color-surface) p-6 md:p-8 rounded-(--radius-card) shadow-sm border border-outline/30">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faUser} className="text-primary text-lg" />
              <h2 className="font-headline-md text-2xl text-text-primary">
                Personal Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-text-secondary">
                  Full Name (as per ID)
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-low focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-text-secondary">
                  National ID Number
                </label>
                <input
                  type="text"
                  placeholder="2850101XXXXXXXX"
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-low focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                />
              </div>
            </div>
          </section>

          {/* Identity Verification */}
          <section className="bg-(--color-surface) p-6 md:p-8 rounded-(--radius-card) shadow-sm border border-outline/30">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon
                icon={faCertificate}
                className="text-primary text-lg"
              />
              <h2 className="font-headline-md text-2xl text-text-primary">
                Identity Verification
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadZone
                label="National ID Front"
                icon="upload_file"
                fieldName="idFront"
                hint="JPG, PNG up to 5MB"
                isUploaded={uploadedFiles["idFront"]}
                onFileChange={handleFileChange}
              />
              <UploadZone
                label="National ID Back"
                icon="upload_file"
                fieldName="idBack"
                hint="JPG, PNG up to 5MB"
                isUploaded={uploadedFiles["idBack"]}
                onFileChange={handleFileChange}
              />
            </div>
          </section>

          {/* Health & Safety Records */}
          <section className="bg-(--color-surface) p-6 md:p-8 rounded-(--radius-card) shadow-sm border border-outline/30">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon
                icon={faHeartPulse}
                className="text-primary text-lg"
              />
              <h2 className="font-headline-md text-2xl text-text-primary">
                Health &amp; Safety Records
              </h2>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-text-secondary">
                  Food Safety Certificate
                </label>
                <UploadZone
                  label="Upload current Health Certificate"
                  icon="medical_services"
                  size="lg"
                  fieldName="healthCert"
                  description="Must be issued within the last 6 months"
                  isUploaded={uploadedFiles["healthCert"]}
                  onFileChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-text-secondary">
                  Police Clearance (Fesh &amp; Tashbeeh)
                </label>
                <UploadZone
                  label="Criminal Record Verification"
                  icon="policy"
                  size="lg"
                  fieldName="policeClearance"
                  description="Required for community safety compliance"
                  isUploaded={uploadedFiles["policeClearance"]}
                  onFileChange={handleFileChange}
                />
              </div>
            </div>
          </section>

          {/* Kitchen Verification */}
          <section className="bg-(--color-surface) p-6 md:p-8 rounded-(--radius-card) shadow-sm border border-outline/30">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon
                icon={faUtensils}
                className="text-primary text-lg"
              />
              <h2 className="font-headline-md text-2xl text-text-primary">
                Kitchen Verification
              </h2>
            </div>
            <p className="text-label-md text-text-secondary mb-6">
              Please provide three clear photos of your cooking environment
              showing cleanliness and organization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`upload-zone relative aspect-square border-2 border-dashed ${uploadedFiles[`kitchenPhoto${num}`] ? "border-primary bg-primary/10" : "border-outline"} rounded-(--radius-card) flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer group`}
                >
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, `kitchenPhoto${num}`)}
                  />
                  <div
                    className={`text-3xl ${
                      uploadedFiles[`kitchenPhoto${num}`]
                        ? "text-primary"
                        : "text-outline"
                    } group-hover:text-primary transition-colors`}
                  >
                    <FontAwesomeIcon
                      icon={
                        uploadedFiles[`kitchenPhoto${num}`]
                          ? faCheckCircle
                          : faImage
                      }
                    />
                  </div>
                  <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-outline">
                    Photo {num}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Optional Certifications */}
          <section className="bg-(--color-surface) p-6 md:p-8 rounded-(--radius-card) shadow-sm border border-outline/30">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon
                icon={faAward}
                className="text-primary text-lg"
              />
              <h2 className="font-headline-md text-2xl text-text-primary">
                Optional Certifications
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-text-secondary">
                  Health Certificate
                </label>
                <div
                  className={`upload-zone relative border ${uploadedFiles["foodSafety"] ? "border-primary bg-primary/5" : "border-outline"} rounded-lg p-4 flex items-center gap-4 hover:bg-outline/10 transition-colors cursor-pointer`}
                >
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, "foodSafety")}
                  />
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUtensils}
                      className="text-secondary"
                    />
                  </div>
                  <span className="font-label-md text-sm text-text-primary">
                    Upload Certificate
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm text-text-secondary">
                  Culinary Certificates
                </label>
                <div
                  className={`upload-zone relative border ${uploadedFiles["culinary"] ? "border-primary bg-primary/5" : "border-outline"} rounded-lg p-4 flex items-center gap-4 hover:bg-outline/10 transition-colors cursor-pointer`}
                >
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, "culinary")}
                  />
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="text-secondary"
                    />
                  </div>
                  <span className="font-label-md text-sm text-text-primary">
                    Upload Certificate
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Confirmation & Action */}
          <div className="pt-6">
            <div className="flex items-start gap-3 mb-8">
              <div className="mt-1">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary cursor-pointer accent-primary"
                />
              </div>
              <label
                htmlFor="confirm"
                className="font-body-md text-base text-text-secondary cursor-pointer select-none"
              >
                I confirm that all submitted information is accurate and that I
                have read and agree to the{" "}
                <a
                  href="#"
                  className="text-primary font-bold hover:underline"
                >
                  Chef Partnership Agreement
                </a>
                .
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-headline-md text-2xl py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <span>
                {isSubmitting ? "Processing..." : "Submit Verification"}
              </span>
              <FontAwesomeIcon
                icon={isSubmitting ? faSpinner : faArrowRight}
                className={isSubmitting ? "animate-spin" : ""}
              />
            </button>
            <p className="text-center mt-6 text-label-sm text-outline">
              Our team typically reviews applications within 24-48 business
              hours.
            </p>
          </div>
        </form>
      </div>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface-low shadow-lg rounded-t-(--radius-card)">
        <div className="flex flex-col items-center justify-center text-text-tertiary">
          <FontAwesomeIcon icon={faHome} className="text-lg" />
          <span className="font-label-sm text-xs">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-primary-container text-white rounded-full px-4 py-1">
          <FontAwesomeIcon icon={faShield} className="text-lg" />
          <span className="font-label-sm text-xs">Verify</span>
        </div>
        <div className="flex flex-col items-center justify-center text-text-tertiary">
          <FontAwesomeIcon icon={faReceipt} className="text-lg" />
          <span className="font-label-sm text-xs">Orders</span>
        </div>
        <div className="flex flex-col items-center justify-center text-text-tertiary">
          <FontAwesomeIcon icon={faUser} className="text-lg" />
          <span className="font-label-sm text-xs">Profile</span>
        </div>
      </nav>
    </main>
  );
}
