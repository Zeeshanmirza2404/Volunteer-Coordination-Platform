import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50">
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 mb-auto">
        <h1 className="text-4xl font-bold mt-5 mb-4">Welcome to VolunteerConnect</h1>
        <p className="text-lg mb-6 max-w-xl">
          Join hands with NGOs and make a real difference! Our platform connects passionate volunteers
          with meaningful events and causes.
        </p>
        <div className="min-h-screen bg-gray-100 text-center px-4 py-8 space-y-8">
          <div className="max-w-4xl mx-auto">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              interval={3000}
              className="rounded-lg shadow-md"
            >
              <div>
                <img src="/volunteerimg1.jpg" alt="Volunteer" />
                <p className="legend bg-black bg-opacity-50">Join hands to serve the community</p>
              </div>
              <div>
                <img src="/volunteerimg3.jpg" alt="NGO work" />
                <p className="legend bg-black bg-opacity-50">Connect with NGOs making a difference</p>
              </div>
              <div>
                <img src="/volunteerimg2.jpeg" alt="Donation" />
                <p className="legend bg-black bg-opacity-50">Support causes with your contribution</p>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
      <footer className="w-full bg-gray-100 text-center text-sm py-4 text-gray-600 mt-auto">
        &copy; {new Date().getFullYear()} VolunteerConnect. Empowering Action.
      </footer>
    </div>
  );
};

export default Home;
