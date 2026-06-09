"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faSpinner, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { verificationService } from "@/services";

function getStatus(response) {
  return response?.data?.data?.status || response?.data?.status || response?.status;
}

export default function WaitingLobby() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);

    try {
      const response = await verificationService.getVerificationStatus();
      const status = getStatus(response);

      if (status === "approved") {
        toast.success("Your verification has been approved.");
        router.replace("/chef/dashboard");
        return;
      }

      if (status === "failed") {
        toast.error("Your verification needs updates.");
        router.replace("/chef/onboarding");
        return;
      }

      toast("Your verification is still pending.");
    } catch (error) {
      if (error?.response?.status === 404) {
        router.replace("/chef/onboarding");
        return;
      }

      toast.error(
        error?.response?.data?.message || "Unable to check verification status.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-secondary-container pt-10 relative overflow-hidden">
        <Image
          src="/waiting1.png"
          alt="Waiting"
          width="200"
          height="200"
          className="absolute bottom-8 -left-10 opacity-20"
        />
        <Image
          src="/waiting2.png"
          alt="Waiting"
          width="200"
          height="200"
          className="absolute top-8 -right-10 opacity-20"
        />

        <div className="w-[60%] mx-auto">
          <div className="mb-4 flex flex-col items-center justify-center mx-auto w-24 h-24 bg-[#f5eae6] rounded-full p-4">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-primary text-6xl  "
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            Verification Submitted <br></br> Successfully
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Thank you for submitting your verification documents. Your documents
            have been sent for review. Our team will evaluate your application
            and notify you via email once a decision has been made.
          </p>
          <div className="lg:flex lg:items-center lg:justify-between  bg-surface-low p-6 rounded-lg shadow-md">
            <div>
              <p className="text-2xl text-primary-container">Status</p>
              <div className="flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-green-500 text-xl mr-2"
                />
                <span className="">
                  Application <br></br> Submitted
                </span>
              </div>
            </div>
            <div className="my-6 lg:my-0">
              <p className="text-2xl">Next Step</p>
              <div className="flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="text-primary-container text-xl mr-2"
                />
                <span className="">
                  Review <br></br> in progress
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl">Updates</p>
              <div className="flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-primary-container text-xl mr-2"
                />
                <span className="">
                  Via <br></br> Email
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col lg:flex-row gap-4 items-center justify-center space-x-4">
            <Link href="/" className="bg-primary text-white py-3 px-10 rounded-3xl hover:bg-primary-container">Back to Home</Link>
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="py-2.5 px-10 rounded-3xl text-primary border-2 border-primary hover:border-primary-container disabled:opacity-70"
            >
              {isChecking ? "Checking..." : "Check Status"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
