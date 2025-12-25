import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../utils/translate';
import { FaUserTie, FaUniversity, FaGraduationCap } from 'react-icons/fa';

const AboutPage = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();

  const teamMembers = [
    {
      name: "Terence",
      role: "Full Stack Developer & AI Specialist",
      university: "Reva University",
      bio: "Passionate about creating innovative solutions that blend fashion with cutting-edge AI technology. Specializing in virtual try-on systems and e-commerce platforms."
    },
    {
      name: "Dilan",
      role: "UI/UX Designer & Frontend Developer",
      university: "Reva University",
      bio: "Focused on creating beautiful, intuitive user experiences that make online shopping seamless and enjoyable. Expert in modern web technologies and design systems."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-light via-primary-dark to-primary-light bg-clip-text text-transparent"
          >
            About TexelModa
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-lg max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Revolutionizing online fashion shopping with AI-powered virtual try-on technology
          </motion.p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Mission
              </h2>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                TexelModa is transforming the way people shop for fashion online by combining artificial intelligence with an intuitive shopping experience. Our virtual try-on technology helps you visualize how clothes look on you before making a purchase.
              </p>
              <ul className="space-y-4">
                {[
                  "AI-powered virtual try-on for realistic clothing visualization",
                  "Seamless shopping experience with personalized recommendations",
                  "Reducing returns and increasing customer satisfaction"
                ].map((point, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <svg className="h-6 w-6 text-primary-light mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Fashion technology"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Meet the Developers
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Built by passionate students from Reva University
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`rounded-2xl shadow-xl overflow-hidden ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`h-32 bg-gradient-to-r ${
                  index === 0 
                    ? 'from-blue-500 to-purple-600' 
                    : 'from-pink-500 to-orange-500'
                }`} />
                
                <div className="relative px-6 pb-8">
                  <div className="flex justify-center -mt-16 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                      }`}
                    >
                      <FaUserTie className={`text-6xl ${
                        index === 0 ? 'text-blue-500' : 'text-pink-500'
                      }`} />
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm font-semibold mb-3 ${
                      index === 0 ? 'text-blue-500' : 'text-pink-500'
                    }`}>
                      {member.role}
                    </p>

                    <div className={`flex items-center justify-center gap-2 mb-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <FaUniversity className="w-4 h-4" />
                      <span className="text-sm font-medium">{member.university}</span>
                    </div>

                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* University Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`mt-12 text-center p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-gradient-to-r from-blue-50 to-purple-50'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaGraduationCap className={`w-8 h-8 ${
                isDarkMode ? 'text-primary-light' : 'text-primary-dark'
              }`} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Reva University
              </h3>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A project developed as part of our academic curriculum, showcasing innovation in AI and web development
            </p>
          </motion.div>
        </section>

        {/* Technology Stack */}
        <section className="mb-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            What We Built
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "AI Virtual Try-On",
                  description: "Advanced AI technology that lets you see how clothes look on you in real-time"
                },
                {
                  title: "Smart Shopping Cart",
                  description: "Intuitive cart system with wishlist integration and smooth checkout"
                },
                {
                  title: "Multi-language Support",
                  description: "Accessible to users worldwide with multiple language options"
                },
                {
                  title: "Responsive Design",
                  description: "Seamless experience across all devices - mobile, tablet, and desktop"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200 shadow-md'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="h-12 w-12 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Innovation",
                description: "We constantly push the boundaries of what's possible with AI and fashion technology."
              },
              {
                icon: (
                  <svg className="h-12 w-12 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "User Experience",
                description: "Everything we do is focused on creating the best possible experience for our users."
              },
              {
                icon: (
                  <svg className="h-12 w-12 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03-3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ),
                title: "Sustainability",
                description: "We're committed to reducing waste in the fashion industry through technology."
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`text-center p-8 rounded-2xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
                }`}
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {value.title}
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AboutPage;