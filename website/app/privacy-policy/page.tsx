// File: app/privacy-policy/page.tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { montserrat } from "@/app/fonts";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Dark Header Section */}
        <section className="bg-[#262626] text-white pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className={`${montserrat.className} text-4xl md:text-5xl font-bold`}>
                Privacy Policy
              </h1>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose lg:prose-lg max-w-none text-gray-700">
              <p className="text-gray-500">Last updated: September 01, 2025</p>

              <h2 className={montserrat.className}>SOLVISER PRIVACY POLICY</h2>
              <p>
                Solviser India Private Limited, a company registered under the Companies Act, 1956 and having its registered office at 29, Shri Krishna Complex, Nani-Chirai-Kachchh, Gujarat-370201, India, (hereinafter referred to as “SOLVISER” & “MSMESOLVISER”).
              </p>
              <p>
                The contents of this privacy policy (“Privacy Policy”) along with the general terms and conditions (“General T&C”) are applicable to all hyperlinks under www.solviser.com (this “Website”). You hereby acknowledge having read and accepted the same by use or access to this Website. We may update this privacy policy periodically, so we encourage you to check it regularly.
              </p>
              <p>
                This privacy statement covers the website. By accessing, using or registering with website, you accept and agree to SOLVISER’s Privacy Policy.
              </p>

              <h3 className={montserrat.className}>I) SOLVISER DATA PRIVACY POLICY</h3>

              <h4 className={montserrat.className}>1) PROTECTION MEASURES AND PROCEDURES</h4>
              <p>
                We value your privacy and understand the importance of safeguarding your personally identifiable information. This includes any details that can identify you, such as your name, address (residential or business), email address, phone number, company information (like GSTN number), and personal details (such as PAN and Aadhar numbers), as well as contact information and banking details.
              </p>
              <p>
                If you choose to withdraw your consent, any personal information you or any consumer has shared will no longer be used or retained by SOLVISER for any purpose. You can withdraw your consent by unsubscribing from our services or by sending a written notice to SOLVISER.
              </p>
              <p>
                We will not sell, trade, or disclose any information obtained from your registration or use of our online services (including company names and addresses) without your consent, unless required by law. However, we may share this information with our Members and Affiliates to assist you in receiving credit reports or for other business-related purposes. Disclosure may also occur as necessary for legal compliance or in situations involving imminent physical harm.
              </p>
              <p>
                We are committed to protecting the information you share with us. We have implemented robust technology, security features, and strict policy guidelines to ensure the privacy of your personally identifiable information from unauthorized access and misuse. We will continue to improve our security measures as technology evolves.
              </p>
              <p>If you have any questions or concerns, please feel free to reach out to us at support@SOLVISER.com.in.</p>

              <h4 className={montserrat.className}>2) INFORMATION COLLECTION AND PURPOSE THEREOF</h4>
              <h5>2.1) INFORMATION COLLECTED</h5>
              <p>
                By using this website/app, you consent to the collection and use of your data, including your company name, GST number, PAN number, Aadhar number, email address, business address, business category, PIN code, telephone or mobile number, director details, and any information obtained through GST APIs or any other different API(s), as well as accounting software, credit card or debit card details (if applicable), bank details, and other relevant interests.
              </p>
              <p>
                SOLVISER collects general types of information such as personal, demographic, behavioral, and indirect information. This can include your IP address, device information, browser type, and geographical location, which is necessary for analyzing resource usage, troubleshooting, preventing fraud, and improving our services.
              </p>
              <h5>2.2) UPDATING THE INFORMATION</h5>
              <p>
                To correct or update any information you’ve provided, you can do so directly on the platform or by reaching out to our support team. If you lose your access details, please send an email to support@solviser.com for assistance.
              </p>
              <h5>2.3) PURPOSE OF COLLECTION</h5>
              <p>
                We collect and analyze the information you provide to improve our service. We may combine your IP address with other personally identifiable information for marketing and research purposes. This information is necessary for you to access the services provided by SOLVISER and to ensure compliance with applicable laws.
              </p>
              
              <h4 className={montserrat.className}>3) USAGE OF INFORMATION COLLECTED</h4>
              <p>
                You agree that we or our Affiliates may contact you to provide offers or information about products/services that we believe may benefit you. SOLVISER may share your information with third parties who assist in delivering our products and services.
              </p>
              <h5>3.1) REVEALING OF INFORMATION</h5>
              <p>
                We may be required to disclose personal information when mandated by law, such as in response to a court order or legal process. We may also use your personal information for verification purposes and share it with third parties solely for that purpose.
              </p>
              <h5>3.2) CONNECTION TO THIRD PARTY WEBSITES</h5>
              <p>
                Our website may include links to third-party websites. These external sites may collect personal information, and our Privacy Policy does not apply to them. We encourage you to review their privacy policies directly.
              </p>
              <h5>3.3) WAY TO COLLECT INFORMATION</h5>
              <p>
                We may use technical methods in HTML emails to track engagement, such as whether you have opened emails or clicked on links within them. This helps us customize the content and advertising you see.
              </p>

              <h4 className={montserrat.className}>4) GOOGLE ADWORDS REMARKETING</h4>
              <p>
                This website uses Google Remarketing to advertise online. Remarketing allows us to show relevant ads to people who have previously visited our site. Any data collected will be used in accordance with our own privacy policy and Google’s privacy policy. You can opt out of Google Analytics for Display Advertising by using the Google Analytics Opt-out Browser Add-on.
              </p>

              <h4 className={montserrat.className}>5) SCOPE OF CHANGES</h4>
              <p>
                If our privacy policy changes in the future, it will be posted on our website. You should access our privacy policy regularly to ensure you understand our current policies. SOLVISER reserves the right to determine the form and means of providing notifications to you.
              </p>
              
              <h3 className={montserrat.className}>II) OTHERS</h3>
              
              <h4 className={montserrat.className}>1) SEVERABILITY</h4>
              <p>
                In the event that any provision of these Terms is declared by any judicial or other competent authority to be void, voidable, illegal or otherwise unenforceable, SOLVISER shall have the right to amend that provision in such reasonable manner as it thinks fit without illegality or it may be severed from this Agreement.
              </p>

              <h4 className={montserrat.className}>2) MINORS</h4>
              <p>
                The Platform and its content are not intended for users who are minors (under 18 years of age). If we discover that a user providing information is under the permissible age, we will promptly delete their account and any related information. Please contact us at support@solviser.com if you believe we have such information.
              </p>
              
              <h4 className={montserrat.className}>3) VARIATION IN PRIVACY POLICY</h4>
              <p>
                SOLVISER reserves the right to issue further directions which shall be applicable to you from time to time. All alterations to these Terms shall be made by SOLVISER with an intimation on its Website, and the term shall become applicable immediately upon such intimation.
              </p>
              
              <h4 className={montserrat.className}>4) INDEMNIFICATION</h4>
              <p>
                You agree to defend, indemnify, and hold harmless SOLVISER, its officers, directors, employees, and agents from any and all losses, damages, liabilities, and claims resulting from any breach of these Terms by you.
              </p>
              
              <h4 className={montserrat.className}>5) TRANSFER OF RIGHTS</h4>
              <p>
                You shall not assign or transfer any of your rights and/or obligations in relation to the transaction contemplated herein under or pursuant to these Terms to any other person.
              </p>

              <h4 className={montserrat.className}>6) GOVERNING LAW, JURISDICTION AND ARBITRATION</h4>
              <p>
                These Terms are governed by and are subject to laws applicable to the Union of India. In the event of any claim, dispute, or difference arising from these Terms, such matters shall be referred to civil or criminal proceedings conducted in the courts of Jaipur, as determined by the Company.
              </p>
              
              <h4 className={montserrat.className}>7) MISCELLANEOUS</h4>
              <p>
                You hereby confer SOLVISER with the right to use any data and information provided by you in any manner, provided that the same shall be valid under applicable law. By providing your mobile number and email address, you have assented to receiving SMS, emails, and calls from SOLVISER and their agents regarding our services.
              </p>

              <h4 className={montserrat.className}>8) FORCE MAJEURE</h4>
              <p>
                SOLVISER shall not be liable for any failure to perform any of its obligations if the performance is prevented, hindered or delayed by a Force Majeure Event, including but not limited to, unavailability of any communication system, fire, flood, explosion, acts of God, civil commotion, war, or acts of government.
              </p>

              <h4 className={montserrat.className}>9) DISCLAIMER</h4>
              <p>
                This privacy policy does not extend to services offered by other companies or individuals, including products or websites that may appear in search results, sites that incorporate SOLVISER services, or any other sites linked from our services.
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}