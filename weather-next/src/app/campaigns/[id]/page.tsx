import CampaignShow from "@/components/CampaignShow";

export default function Page({ params }: { params: { id: string } }) {
  return <CampaignShow campaignId={params.id} />;
}
