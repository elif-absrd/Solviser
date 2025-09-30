// File: apps/website/src/components/Testimonials.tsx
import Image from 'next/image';

const testimonials = [
  {
    quote: "Solviser's AI tools have been a game-changer for our business. We've reduced our credit risk by over 30% in just one quarter.",
    name: 'Rohan Sharma',
    title: 'CFO, Apex Industries',
    image: '/avatars/rohan.jpg', // Placeholder - add images to public/avatars/
  },
  {
    quote: 'The insights are incredibly accurate and easy to understand. We can now make faster, more confident decisions.',
    name: 'Priya Mehta',
    title: 'CEO, Innovate Exports',
    image: '/avatars/priya.jpg',
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Trusted by Indian MSMEs
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Hear from businesses that have transformed their risk management with us.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-lg italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}