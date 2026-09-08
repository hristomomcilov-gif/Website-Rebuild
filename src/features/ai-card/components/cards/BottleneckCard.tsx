import { Disclosure } from "@/components/ui/Disclosure";
import { LABELS, MAP_WRAPPER } from "../../content";
import type { PathFixture } from "../../content/types";
import { CardHeader } from "./CardHeader";

export function BottleneckCard({ path }: { path: PathFixture }) {
  return (
    <article aria-labelledby="card-1-title" className="flex flex-col gap-5">
      <CardHeader index={1} label={MAP_WRAPPER.cardTitles[0]} title={path.card1.title} titleId="card-1-title" />
      <p className="text-sm text-ink-muted">{LABELS.sourceLine}</p>
      <div className="flex flex-col gap-4 text-base leading-relaxed text-ink-muted">
        {path.card1.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      <Disclosure summary={MAP_WRAPPER.unknownLink}>{path.card1.unknown}</Disclosure>
      <Disclosure summary={MAP_WRAPPER.validateHeading} defaultOpen>
        <p className="text-ink">{path.card1.validate}</p>
      </Disclosure>
    </article>
  );
}
