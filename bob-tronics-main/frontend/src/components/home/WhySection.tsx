const reasons = [
  {
    number: "01",
    title: "Authenticity, always",
    text: "Verified devices with clear warranty coverage.",
  },
  {
    number: "02",
    title: "People-first expertise",
    text: "Helpful specialists, without the jargon.",
  },
  {
    number: "03",
    title: "Support beyond purchase",
    text: "Delivery, setup and care that keep you going.",
  },
];

export default function WhySection() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {reasons.map((reason) => (
        <div key={reason.number}>
          <p className="text-sm font-bold text-primary">{reason.number} /</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{reason.title}</h3>
          <p className="mt-2 text-muted">{reason.text}</p>
        </div>
      ))}
    </div>
  );
}
