import { Projects } from './projects/Projects';
import { Trainings } from './trainings/Trainings';
import { Team } from './team/Team';

export const Home = () => {
  return (
    <div className="bg-gray-100 text-gray-900">
      <header className="bg-blue-500 text-white text-center py-8">
        <h1 className="text-4xl font-bold">RTCU at IOE, Tribhuvan University</h1>
        <p className="mt-2 text-lg">Research, Training, and Consultancy Unit</p>
      </header>
      <section id="services" className="p-8">
        <h2 className="text-2xl font-semibold">Our Services</h2>
        <p className="mt-4">We provide research, technical training, and consultancy.</p>
      </section>
      <section id="projects" className="bg-white p-8">
        <h2 className="text-2xl font-semibold">Ongoing Projects</h2>
        <ul className="mt-4 list-disc pl-6">
          <li>Hospital Management System</li>
          <li>IT Infrastructure Development</li>
          <li>Online Exam System</li>
        </ul>
      </section>
      <footer className="bg-blue-500 text-white text-center py-4">
        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p className="mt-2">Email: rtcuprogram@tu.edu.np</p>
      </footer>
    </div>
  );
}