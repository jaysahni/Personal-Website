import type { Metadata } from "next";
import Divider from "@/components/ui/Divider";
import { contactLinks } from "@/data/contact-links";
import { specs } from "@/data/specs";
import { library } from "@/data/library";
import { learningResources } from "@/data/learning";

export const metadata: Metadata = {
  title: "Links",
};

export default function LinksPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-8">links</h1>

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">contact</h2>
        <div className="space-y-2">
          {contactLinks.map((link) => (
            <div key={link.platform} className="flex items-center gap-3 text-sm">
              <span className="text-text-muted w-20">{link.platform}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-text-secondary"
              >
                {link.handle}
              </a>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">specs</h2>
        <div className="space-y-0">
          {specs.map((item) => (
            <div
              key={item.component}
              className="flex justify-between py-1.5 border-b border-border/50 text-sm"
            >
              <span className="text-text-muted">{item.component}</span>
              <span className="text-text-primary">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">library</h2>
        <div className="space-y-3">
          {library.map((item) => (
            <div key={item.name} className="text-sm">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:text-accent transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <span className="text-text-primary">{item.name}</span>
              )}
              <p className="text-text-muted text-xs mt-0.5">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">learning</h2>
        <div className="space-y-3">
          {learningResources.map((item) => (
            <div key={item.name} className="text-sm">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:text-accent transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <span className="text-text-primary">{item.name}</span>
              )}
              <p className="text-text-muted text-xs mt-0.5">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
