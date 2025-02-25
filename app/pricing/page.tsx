import { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Pricing - SaaS Starter",
  description: "Simple, transparent pricing for everyone",
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for trying out our platform",
      features: [
        "Up to 10 users",
        "Basic features",
        "Community support",
        "1GB storage",
        "API access",
      ],
      cta: "Get Started",
      href: "/register",
    },
    {
      name: "Pro",
      price: "29",
      description: "Best for professionals and growing teams",
      features: [
        "Unlimited users",
        "All Free features",
        "Priority support",
        "100GB storage",
        "Advanced analytics",
        "Custom integrations",
      ],
      cta: "Start Free Trial",
      href: "/register?plan=pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "99",
      description: "For large organizations with custom needs",
      features: [
        "Everything in Pro",
        "24/7 phone support",
        "Unlimited storage",
        "Custom contract",
        "SLA guarantee",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      href: "/contact",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ title: "Home", href: "/" }, { title: "Pricing" }]} />
      
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your needs. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col p-6 bg-card rounded-lg shadow-lg border ${
              tier.popular ? "border-primary" : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <p className="text-muted-foreground">{tier.description}</p>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={tier.popular ? "default" : "outline"}
              asChild
            >
              <a href={tier.href}>{tier.cta}</a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 