import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../utils/translate';
import { FaUserTie } from 'react-icons/fa';

const AboutPage = () => {
  const { currentLanguage } = useLanguage();

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
            {translate('about.title', currentLanguage)}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto dark:text-gray-100">
            {translate('about.subtitle', currentLanguage)}
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 dark:text-white">
                {translate('about.mission.title', currentLanguage)}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 dark:text-gray-100">
                {translate('about.mission.description', currentLanguage)}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary-light mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300 dark:text-gray-100">
                    {translate('about.mission.point1', currentLanguage)}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary-light mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300 dark:text-gray-100">
                    {translate('about.mission.point2', currentLanguage)}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary-light mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300 dark:text-gray-100">
                    {translate('about.mission.point3', currentLanguage)}
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt={translate('about.mission.imageAlt', currentLanguage) || "Fashion technology"}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            {translate('about.team.title', currentLanguage)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: translate('about.team.name', currentLanguage),
                role: translate('about.team.role', currentLanguage),
                bio: translate('about.team.bio', currentLanguage)
              },
              {
                name: translate('about.team.name', currentLanguage),
                role: translate('about.team.role', currentLanguage),
                bio: translate('about.team.bio', currentLanguage)
              }
            ].map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <div className="flex justify-center mt-6 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    whileTap={{ scale: 0.95, rotate: -8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <FaUserTie className="text-7xl text-primary-light" />
                  </motion.div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">{member.name}</h3>
                  <p className="text-primary-light mb-4 dark:text-primary-light">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 dark:text-gray-100">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Website Details Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            {translate('about.website.title', currentLanguage)}
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
              {translate('about.website.description', currentLanguage)}
            </p>
            <ul className="list-disc list-inside text-left text-gray-600 dark:text-gray-300 mx-auto inline-block">
              <li>{translate('about.website.feature1', currentLanguage)}</li>
              <li>{translate('about.website.feature2', currentLanguage)}</li>
              <li>{translate('about.website.feature3', currentLanguage)}</li>
              <li>{translate('about.website.feature4', currentLanguage)}</li>
            </ul>
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            {translate('about.values.title', currentLanguage)}
          </h2>
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
                title: "Customer First",
                description: "Everything we do is focused on creating the best possible experience for our users."
              },
              {
                icon: (
                  <svg className="h-12 w-12 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ),
                title: "Sustainability",
                description: "We're committed to reducing waste in the fashion industry through technology."
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 dark:text-gray-100">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AboutPage; 