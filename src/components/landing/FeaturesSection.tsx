"use client";
import { motion } from "framer-motion";
import { Crown, TrendingUp, CheckCircle, Users } from "lucide-react";
import Image from "next/image";

const FeaturesSection = () => {
  const features = [
    {
      id: "memberships",
      title: "Effortless Subscriptions",
      description:
        "Set up your plans once and let Reetrack handle the rest. Members pay, renewals happen, and you get notified when something needs attention. No more chasing payments or losing track of who's active your revenue flows without you lifting a finger.",
      pic: "reports",
      accentColor: "#F06543",
      Icon: Crown,
      highlight: "Effortless",
      reverse: false,
    },
    {
      id: "crm",
      title: "Know Your People",
      description:
        "See exactly who's showing up, who's at risk of leaving, and who your most engaged members are. Reetrack turns your member activity into real insight — so you can act before someone walks out the door instead of after.",
      pic: "community",
      accentColor: "#0D9488",
      Icon: TrendingUp,
      highlight: "People",
      reverse: true,
    },
    {
      id: "payments",
      title: "Payments without frction",
      description:
        "Members pay directly through Reetrack — clean, fast, and tracked automatically. No more manual confirmations, no more missed dues. Every transaction is recorded, every member account stays up to date.",
      pic: "payment",
      accentColor: "#F06543",
      Icon: CheckCircle,
      // highlight: "Friction",
      reverse: false,
    },
    {
      id: "rewards",
      title: "Rewards that retain",
      description:
        "Every check-in builds a streak. Every streak earns recognition. Reetrack's leaderboard system rewards your most consistent members giving them a reason to keep showing up that goes beyond just their goals. Engaged members stay. Staying members pay.",
      pic: "rewards",
      accentColor: "#0D9488",
      Icon: Users,
      highlight: "Rewards",
      reverse: true,
    },
  ];

  return (
    <section className="relative py-32 bg-[#F9FAFB] overflow-hidden">
      {/* Grain texture - concrete wall */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Parallax paint drips */}
      <motion.div
        className="absolute top-0 left-[10%] w-2 h-32 bg-[#0D9488]/20 rounded-b-full"
        initial={{ y: -100 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-20 right-[15%] w-2 h-24 bg-[#F06543]/20 rounded-b-full"
        initial={{ y: -80 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] relative inline-block">
            Everything your community needs
            {/* Marker underline */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "circOut" }}
              className="absolute bottom-0 left-0 h-3 bg-[#0D9488]/30 -z-10"
            />
          </h2>
        </motion.div>

        {/* Features Grid - Zig-Zag */}
        <div className="space-y-40">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-20 items-center ${
                feature.reverse ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Text Content */}
              <div className={feature.reverse ? "lg:col-start-2" : ""}>
                {/* Accent paint stroke */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-1.5 mb-8"
                  style={{ backgroundColor: feature.accentColor }}
                />

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-6 leading-tight relative">
                  {feature.highlight ? (
                    <>
                      {feature.title.split(feature.highlight)[0]}
                      <span className="relative inline-block mx-2">
                        {feature.highlight}
                      </span>
                      {feature.title.split(feature.highlight)[1]}
                    </>
                  ) : (
                    feature.title
                  )}
                </h3>

                <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-8">
                  {feature.description}
                </p>

                {/* Draggable icon sticker */}
                <motion.div
                  drag
                  dragConstraints={{ left: 0, right: 100, top: 0, bottom: 100 }}
                  whileDrag={{ scale: 1.1, rotate: 10 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-4 border-[#1F2937] rotate-3 cursor-grab active:cursor-grabbing"
                  style={{
                    boxShadow: "6px 6px 0px 0px rgba(31, 41, 55, 1)",
                  }}
                >
                  <feature.Icon
                    className="w-10 h-10"
                    style={{ color: feature.accentColor }}
                    strokeWidth={2.5}
                  />
                </motion.div>
              </div>

              {/* Circular Image */}
              <div
                className={
                  feature.reverse ? "lg:col-start-1 lg:row-start-1" : ""
                }
              >
                <div className="relative mx-auto w-80 h-80 lg:w-[480px] lg:h-[480px]">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "backOut" }}
                    className="relative w-full h-full rounded-full border-4 border-[#1F2937] bg-white overflow-hidden"
                    style={{
                      boxShadow: "12px 12px 0px 0px rgba(31, 41, 55, 1)",
                    }}
                  >
                    <Image
                      src={`/features/${feature.pic}.webp`}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
