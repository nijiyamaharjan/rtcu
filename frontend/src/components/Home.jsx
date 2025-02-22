import React from 'react';
import { Projects } from './projects/Projects';
import { Trainings } from './trainings/Trainings';
import { Team } from './team/Team';
import tuLogo from '../assets/tu-logo.png';
import { BookOpen, Users, Target, Microscope, GraduationCap, LineChart } from 'lucide-react';

export const Home = () => {
  const aboutItems = [
    {
      icon: <Microscope className="w-8 h-8 text-indigo-600" />,
      title: "Research Excellence",
      description: "Conducting cutting-edge research in engineering and technology"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
      title: "Quality Training",
      description: "Providing specialized technical training programs for professionals"
    },
    {
      icon: <LineChart className="w-8 h-8 text-indigo-600" />,
      title: "Expert Consultancy",
      description: "Offering professional consultancy services across various domains"
    }
  ];

  const objectives = [
    "To promote research culture in engineering education",
    "To enhance the quality of engineering education through practical training",
    "To provide expert consultancy services to industries and organizations",
    "To establish linkages with national and international research institutions",
    "To develop innovative solutions for engineering challenges"
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-900 text-white py-8 px-4 ">
        <div className="max-w-5xl mx-auto text-center">
          <img 
            src={tuLogo}
            alt="TU Logo"
            className="mx-auto mb-6 h-20 w-auto"
          />
          <h1 className="text-3xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            RTCU at IOE, Tribhuvan University
          </h1>
          <p className="mt-4 text-xl font-medium text-blue-100">
            Research, Training, and Consultancy Unit
          </p>
        </div>
      </header>

      <section id="about" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
            About Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {aboutItems.map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-indigo-50 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="objectives" className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
            Our Objectives
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <div 
                key={index}
                className="flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Target className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <p className="ml-4 text-lg text-gray-700">{objective}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg">
            For inquiries, email us at{' '}
            <a 
              href="mailto:rtcuprogram@tu.edu.np" 
              className="text-blue-200 hover:text-white underline transition-colors duration-300"
            >
              rtcuprogram@tu.edu.np
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;