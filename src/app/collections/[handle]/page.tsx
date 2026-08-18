import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPageTemplate } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/CollectionPageTemplate";
import {
  getAllCollectionHandles,
  getCollectionData,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/getCollectionData";

export function generateStaticParams() {
  return getAllCollectionHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionData(handle);

  if (!collection) {
    return {};
  }

  return {
    title: `${collection.title} – Arte Collective`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionData(handle);

  if (!collection) {
    notFound();
  }

  return <CollectionPageTemplate collection={collection} />;
}
