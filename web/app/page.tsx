import Hero from "@/components/sections/Hero";
import PathSelector from "@/components/sections/PathSelector";
import BlinksLoop from "@/components/sections/BlinksLoop";
import Platforms from "@/components/sections/Platforms";
import Automation from "@/components/sections/Automation";
import Industries from "@/components/sections/Industries";
import Proof from "@/components/sections/Proof";
import Process from "@/components/sections/Process";
import Pricing from "@/components/sections/Pricing";
import RoiCalculator from "@/components/sections/RoiCalculator";
import Social from "@/components/sections/Social";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Reorder from "@/components/site/Reorder";

/**
 * Bands are assigned here and in Reorder, never inside a section — a section only uses
 * the semantic tokens and inherits whichever surface it lands on. That is what lets
 * §7.3's re-ordering shuffle the page without ever putting two dark bands together.
 */
export default function Home() {
  return (
    <>
      <div className="band-dark">
        <Hero />
      </div>
      <div className="band-light">
        <PathSelector />
      </div>
      <Reorder
        items={[
          { key: "loop", node: <BlinksLoop /> },
          { key: "platforms", node: <Platforms /> },
          { key: "automation", node: <Automation /> },
          { key: "industries", node: <Industries /> },
          { key: "proof", node: <Proof /> },
          { key: "process", node: <Process /> },
          { key: "pricing", node: <Pricing /> },
          { key: "calculator", node: <RoiCalculator /> },
          { key: "social", node: <Social /> },
          { key: "faq", node: <Faq /> },
        ]}
      />
      <div className="band-dark">
        <FinalCta />
      </div>
    </>
  );
}
