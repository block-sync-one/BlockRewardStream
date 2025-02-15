
import { title, subtitle } from "@/components/primitives";

import { StakeGroupWrapper } from "@/components/stake-group-wrapper";
import { WalletContext } from "@/components/wallet-context";
// import { useState } from "react";
// import { useSearchParams } from "next/navigation";

export default function Home() {
  // const searchParams = useSearchParams();
  // const selectedValidatorId = searchParams.get("selected");
  // const validators = JSON.parse(searchParams.get("validators") || "[]");
  // const selectedValidator = validators.find((v: Validator) => v.vote_identity === selectedValidatorId);

  
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-screen-xlg text-center justify-center">
        <span className={title()}>Block&nbsp;</span>
        <span className={title({ color: "primary" })}>Reward&nbsp;</span>
        <span className={title()}>
          Sharing
        </span>
        <div className={subtitle({ class: "mt-4" })}>
        SIMD96 is out but validators cannot share block rewards with stakers properly.<br/>
        While we await the SIMD0123 release, take advantage of our tool to effortlessly calculate and share block rewards with your stakers.
        </div>
      </div>
      <WalletContext />
     
    </section>
  );
}
