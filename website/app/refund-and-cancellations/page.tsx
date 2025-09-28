// File: app/refund-and-cancellations/page.tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { montserrat } from "@/app/fonts";

export default function CancellationAndRefundPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Dark Header Section */}
        <section className="bg-[#262626] text-white pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className={`${montserrat.className} text-4xl md:text-5xl font-bold`}>
                Cancellation & Refund Policy
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose lg:prose-lg max-w-none text-gray-700">
              <p className="text-gray-500">Last Updated: September 1, 2025</p>
              <p>
                This Cancellation & Refund Policy (“Policy”) applies to all purchases and subscriptions made with Solviser India Pvt. Ltd.
              </p>

              <h2 className={montserrat.className}>1. Subscription Cancellation</h2>
              <p>
                Users may cancel their subscription at any time through their account settings or by contacting customer support.
              </p>
              <p>
                Cancellation will stop future billing, but no partial refunds will be provided for the remaining subscription period (unless otherwise required by law).
              </p>

              <h2 className={montserrat.className}>2. Refunds</h2>
              <p>Refunds are applicable only in the following cases:</p>
              <ul>
                <li>
                  <strong>Duplicate Payment:</strong> If you are charged twice for the same transaction.
                </li>
                <li>
                  <strong>Technical Issues:</strong> If you are unable to access the Services due to verified technical faults on our end.
                </li>
                <li>
                  <strong>Service Non-Delivery:</strong> If we fail to provide the purchased service within the committed time frame.
                </li>
              </ul>
              <p>Refunds are not provided in the following cases:</p>
              <ul>
                <li>Change of mind or personal circumstances.</li>
                <li>Failure to use the Services during the subscription period.</li>
              </ul>

              <h2 className={montserrat.className}>3. Refund Process</h2>
              <p>
                To request a refund, contact us at support@solviser.com with your order details.
              </p>
              <p>
                Approved refunds will be processed within 7–10 business days to the original payment method.
              </p>

              <h2 className={montserrat.className}>4. Trial/Promotional Offers</h2>
              <p>
                Any trial or promotional subscription is provided free of charge and is non-refundable.
              </p>

              <h2 className={montserrat.className}>5. Modifications</h2>
              <p>
                Solviser India Pvt. Ltd. reserves the right to update this Policy from time to time. Updates will be posted on our website.
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}