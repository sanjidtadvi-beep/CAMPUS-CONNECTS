import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function SplashIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.23, 1, 0.32, 1] } }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center flex-col overflow-hidden select-none"
        >
          {/* Future/Tech Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />

          {/* Glitchy/Technical Background Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
             <svg width="600" height="600" viewBox="0 0 600 600" className="w-[120vw] h-[120vw] max-w-2xl text-white">
                <motion.circle
                  cx="300"
                  cy="300"
                  r="250"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  initial={{ pathLength: 0, rotate: -90 }}
                  animate={{ pathLength: 1, rotate: 270 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 300 L 500 300 M 300 100 L 300 500"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                {[0, 90, 180, 270].map((angle) => (
                  <motion.circle
                    key={angle}
                    cx={300 + 250 * Math.cos((angle * Math.PI) / 180)}
                    cy={300 + 250 * Math.sin((angle * Math.PI) / 180)}
                    r="3"
                    fill="currentColor"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.8 }}
                  />
                ))}
             </svg>
          </motion.div>

          <div className="relative z-10 text-center px-6">
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6"
            >
              Protocol Genesis
            </motion.div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <h1 className="text-4xl md:text-7xl font-black italic tracking-[-0.04em] text-white uppercase flex flex-wrap justify-center overflow-hidden px-4">
                 {"CAMPUS".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 100, rotateX: -90 }}
                      animate={{ y: 0, rotateX: 0 }}
                      transition={{ 
                        duration: 1, 
                        delay: 0.5 + (index * 0.08),
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                 ))}
                 <span className="w-4 md:w-8" />
                 {"CONNECTS".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 100, rotateX: -90 }}
                      animate={{ y: 0, rotateX: 0 }}
                      transition={{ 
                        duration: 1, 
                        delay: 1 + (index * 0.08),
                        ease: [0.23, 1, 0.32, 1]
                      }}
                      className="inline-block text-primary"
                    >
                      {char}
                    </motion.span>
                 ))}
              </h1>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
              className="h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent mt-8 w-full max-w-md mx-auto"
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1, delay: 2.2 }}
              className="mt-6 text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground italic"
            >
              Synchronizing Social Mesh...
            </motion.p>
          </div>

          {/* Bottom Data Stream */}
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end opacity-20 pointer-events-none">
            <div className="font-mono text-[8px] space-y-1">
              <div>// NODE_LINK_ESTABLISHED</div>
              <div>// AUTH_TOKEN_READY</div>
              <div>// BYTES_RX: 1024KB</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
