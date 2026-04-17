"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import BirthDataForm from "@/components/BirthDataForm";

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-plum-900 via-plum-800/20 to-plum-900 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative text-center"
        >
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-light text-sand-200 tracking-wide mb-6">
            The Bridge
          </h1>
          <p className="font-heading text-xl sm:text-2xl text-sand-400 font-light max-w-lg mx-auto mb-12 leading-relaxed">
            Where your lived sky meets the ancient one.
            <br />
            Two charts. One&nbsp;you.
          </p>
          <button
            onClick={scrollToForm}
            className="font-heading text-lg text-sand-300 border border-plum-700 rounded-full px-8 py-3 hover:bg-plum-700/30 transition-all duration-500"
          >
            Begin
          </button>
        </motion.div>
      </section>

      {/* Form */}
      <section
        ref={formRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-heading text-3xl sm:text-4xl text-sand-200 font-light text-center mb-12"
        >
          When were you born?
        </motion.h2>
        <BirthDataForm />
      </section>
    </main>
  );
}
