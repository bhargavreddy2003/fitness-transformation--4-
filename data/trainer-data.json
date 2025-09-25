"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { FaInstagram, FaEnvelope } from "react-icons/fa"
import trainerData from "../data/trainer-data.json"

// Utility for animated counters
const AnimatedCounter = ({
  from,
  to,
  duration,
  suffix = "",
}: { from: number; to: number; duration: number; suffix?: string }) => {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (inView) {
      let start: number | null = null
      const animate = (currentTime: number) => {
        if (!start) start = currentTime
        const progress = (currentTime - start) / duration
        const currentCount = Math.min(to, from + (to - from) * progress)
        setCount(Math.floor(currentCount))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, from, to, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export default function TrainerProfile() {
  const controls = useAnimation()
  const heroRef = useRef(null)
  const inView = useInView(heroRef, { once: true })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      {/* Hero / About Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1.5 } },
        }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <Image
          src="/trainer-working-out.jpg"
          alt="Trainer background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div> {/* Dark overlay */}

        {/* Top right Apply Button */}
        <motion.a
          href={trainerData.applyFormLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute top-8 right-8 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 hover:-rotate-3 z-20 text-lg cursor-pointer"
        >
          Apply to Transform
        </motion.a>

        <div className="relative z-20 text-center p-8 bg-black/70 rounded-lg shadow-lg border border-primary/30 backdrop-blur-sm">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 text-balance">{trainerData.trainerName}</h1>
          <p className="text-2xl md:text-3xl text-white/90 text-pretty">{trainerData.specialization}</p>
        </div>
      </motion.section>

      {/* Why Train With Me Section */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[url('/subtle-paper-texture.jpg')] bg-repeat opacity-5"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center text-primary mb-12"
          >
            Why Train With Me?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-secondary/30 p-8 rounded-lg shadow-xl border border-primary/20"
            >
              <h3 className="text-3xl font-semibold text-white mb-6">Personal Records</h3>
              <ul className="space-y-4 text-lg text-white/80">
                {trainerData.prs.map((pr, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b border-primary/20 pb-2 last:border-b-0"
                  >
                    <span>{pr.exercise}:</span>
                    <span className="font-bold text-primary">{pr.weight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-secondary/30 p-8 rounded-lg shadow-xl border border-primary/20"
            >
              <h3 className="text-3xl font-semibold text-white mb-6">Benefits of Training</h3>
              <ul className="space-y-4 text-lg text-white/80">
                {trainerData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-3 text-2xl">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-xl text-center text-white/70 max-w-3xl mx-auto text-pretty"
          >
            {trainerData.aboutText}
          </motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center text-primary mb-12"
          >
            My Services
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainerData.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-secondary/30 p-6 rounded-lg shadow-xl border border-primary/20 text-center hover:scale-[1.02] transition-transform duration-300"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">{service}</h3>
                <p className="text-white/70">Achieve your goals with a tailored program.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Numbers / Stats Section */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[url('/subtle-paper-texture.jpg')] bg-repeat opacity-5"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center text-primary mb-12"
          >
            Client Success
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 mb-12 text-xl text-center text-white/70 max-w-3xl mx-auto text-pretty"
          >
            I'm proud of the results my clients achieve. Here's a look at some key metrics that highlight the impact of
            personalized training.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            {trainerData.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-secondary/30 p-8 rounded-lg shadow-xl border border-primary/20 text-center"
              >
                <div className="text-6xl font-bold text-primary mb-4">
                  <AnimatedCounter from={0} to={stat.value} duration={2000} suffix={stat.unit} />
                </div>
                <p className="text-xl text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio + Contact Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">My Portfolio</h2>
              <motion.a
                href={trainerData.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-primary/80 transition-colors duration-300 cursor-pointer group"
              >
                <FaInstagram className="mr-3 text-3xl group-hover:scale-110 transition-transform duration-300" />
                View My Instagram
              </motion.a>
            </motion.div>

            {/* Get In Touch */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">Get In Touch</h2>
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 justify-center md:justify-start">
                <a
                  href={trainerData.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  <FaInstagram className="text-6xl hover:scale-110 transition-transform duration-300" />
                </a>
                <a
                  href={trainerData.gmailLink}
                  className="text-white hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  <FaEnvelope className="text-6xl hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            Ready to Transform?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/70 mb-8 max-w-3xl mx-auto"
          >
            Take the first step towards achieving your fitness goals. Apply now for a personalized training program and guidance from me.
          </motion.p>
          <motion.a
            href={trainerData.applyFormLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-2xl px-10 py-5 rounded-xl shadow-lg transition-transform duration-300 hover:-rotate-3 cursor-pointer"
          >
            Apply to Transform
          </motion.a>
        </div>
      </section>

      <footer className="py-8 bg-secondary/30 text-center text-white/60 text-sm">
        <div className="container mx-auto px-4">
          <p>
            &copy; {new Date().getFullYear()} {trainerData.trainerName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
