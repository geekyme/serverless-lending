import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Finloan: Your Gateway to Business Growth
      </h1>
      <p className="text-xl mb-8">
        Empowering small and medium businesses with tailored financial
        solutions.
      </p>
      <div className="space-y-6 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Why Choose Finloan?</h2>
          <ul className="list-disc list-inside text-left">
            <li>Quick and easy application process</li>
            <li>Competitive interest rates</li>
            <li>Flexible repayment terms</li>
            <li>Dedicated support throughout your journey</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
          <ol className="list-decimal list-inside text-left">
            <li>Fill out our simple online application</li>
            <li>Receive a decision within 48 hours</li>
            <li>Get funds deposited directly to your account</li>
          </ol>
        </div>
      </div>
      <Link
        href="/apply"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
      >
        Start Your Application
      </Link>
    </div>
  );
}
