import {
  absoluteUrl,
  FEATURE_CARDS,
  OG_IMAGE,
  ORGANIZATION_SAME_AS,
  SITE_DEFINITION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/site";

export function HomeStructuredData() {
  const homeUrl = absoluteUrl("/");
  const organizationId = `${homeUrl}#organization`;
  const websiteId = `${homeUrl}#website`;
  const softwareId = `${homeUrl}#software`;
  const webpageId = `${homeUrl}#webpage`;
  const imageUrl = absoluteUrl(OG_IMAGE.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: homeUrl,
        description: SITE_DESCRIPTION,
        image: imageUrl,
        sameAs: [...ORGANIZATION_SAME_AS],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: homeUrl,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: homeUrl,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        isPartOf: { "@id": websiteId },
        about: { "@id": softwareId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": softwareId,
        name: SITE_NAME,
        url: homeUrl,
        image: imageUrl,
        applicationCategory: "DeveloperApplication",
        description: SITE_DEFINITION,
        featureList: FEATURE_CARDS.map((card) => card.description),
        creator: { "@id": organizationId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
