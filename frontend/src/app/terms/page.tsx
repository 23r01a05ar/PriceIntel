export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-jakarta mb-8 text-foreground">Terms of Service</h1>
      
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <p className="font-semibold text-foreground">Effective Date: January 1, 2026</p>
        
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the PredictKaro website, applications, or services (collectively, the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Acceptable Use</h2>
          <p>
            You agree to use the Service only for lawful purposes. You must not use the Service to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Engage in any automated scraping, data mining, or extraction methods against our infrastructure.</li>
            <li>Attempt to bypass or break any security mechanism of the Service.</li>
            <li>Transmit any malicious code, viruses, or destructive materials.</li>
            <li>Violate the intellectual property rights of PredictKaro, its providers, or any third party.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Account Responsibilities</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Third-Party API Usage & Disclaimers</h2>
          <p>
            PredictKaro acts as a search aggregator, utilizing third-party APIs to fetch real-time product data, images, and prices. PredictKaro does not guarantee the accuracy, completeness, or timeliness of data retrieved from these third parties.
          </p>
          <p className="mt-4">
            <strong>Pricing Disclaimers:</strong> Prices displayed on PredictKaro are subject to change instantly by the retailer. PredictKaro is not responsible for price discrepancies between our platform and the final retailer checkout page. The purchase contract is solely between you and the retailer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Warranties & Limitations of Liability</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. PredictKaro makes no warranties, expressed or implied, regarding the reliability or availability of the Service. In no event shall PredictKaro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Modifications to Service</h2>
          <p>
            We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.
          </p>
        </section>
      </div>
    </div>
  );
}
