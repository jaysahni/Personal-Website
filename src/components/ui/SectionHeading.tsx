interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: Props) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      {subtitle && (
        <p className="text-text-secondary mt-1 text-sm">{subtitle}</p>
      )}
    </div>
  );
}
