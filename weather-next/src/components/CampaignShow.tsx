"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  DownloadIcon,
  TrendUpIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { PauseIcon, PlayIcon } from "lucide-react";

type Page =
  | "dashboard"
  | "campaigns"
  | "leads"
  | "users"
  | "create-role"
  | "campaign-show";

interface CampaignShowProps {
  campaignId: string | null;
}

interface CampaignShow {
  id: string;
  name: string;
  company: string;
  location: string;
  status: "active" | "paused" | "completed" | "draft";
  progress: number;
  leads: number;
  applicants: number;
  hired: number;
  lastUpdate: string;
  description?: string;
  createdDate: string;
  targetLeads: number;
  budget: number;
}

interface CampaignLead {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  status: "contacted" | "responded" | "interested" | "rejected" | "hired";
  contactDate: string;
  lastActivity: string;
  leadScore: number;
}

export default function CampaignShow({ campaignId }: CampaignShowProps) {
  const router = useRouter();
  const [campaigns] = useState<CampaignShow[]>([
    {
      id: "1",
      name: "Frontend Master",
      company: "HFORCE",
      location: "Remote",
      status: "active",
      progress: 68,
      leads: 245,
      applicants: 156,
      hired: 12,
      lastUpdate: "21.08.2025 | 18:15",
      createdDate: "21.08.2025",
      targetLeads: 3,
      budget: 1,
      description:
        "Senior Frontend Developer position focusing on React and TypeScript",
    },
  ]);

  const campaign = campaigns.find((c: CampaignShow) => c.id === campaignId);

  const [campaignLeads] = useState<CampaignLead[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@techcorp.com",
      company: "TechCorp Inc.",
      position: "Senior Developer",
      status: "contacted",
      contactDate: "2025-01-15",
      lastActivity: "2025-01-16",
      leadScore: 85,
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria.garcia@innovate.es",
      company: "Innovate Solutions",
      position: "Product Manager",
      status: "responded",
      contactDate: "2025-01-14",
      lastActivity: "2025-01-15",
      leadScore: 92,
    },
    {
      id: "3",
      name: "Hans Mueller",
      email: "hans.mueller@autotech.de",
      company: "AutoTech GmbH",
      position: "Engineering Lead",
      status: "interested",
      contactDate: "2025-01-13",
      lastActivity: "2025-01-14",
      leadScore: 78,
    },
    {
      id: "4",
      name: "Sophie Laurent",
      email: "sophie.laurent@fintech.fr",
      company: "FinTech Paris",
      position: "CTO",
      status: "hired",
      contactDate: "2025-01-10",
      lastActivity: "2025-01-12",
      leadScore: 96,
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.wilson@startup.co.uk",
      company: "Startup Solutions",
      position: "Founder",
      status: "rejected",
      contactDate: "2025-01-12",
      lastActivity: "2025-01-13",
      leadScore: 88,
    },
  ]);

  if (!campaign) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Campaign not found</h3>
            <p className="text-muted-foreground mb-4">
              The requested campaign could not be found.
            </p>
            <Button onClick={() => router.push("/campaigns")}>
              <ArrowLeftIcon size={20} className="mr-2" />
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: CampaignShow["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeadStatusColor = (status: CampaignLead["status"]) => {
    switch (status) {
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "responded":
        return "bg-yellow-100 text-yellow-800";
      case "interested":
        return "bg-orange-100 text-orange-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportCampaignData = () => {
    const csv = [
      "Name,Email,Company,Position,Status,Contact Date,Last Activity,Lead Score",
      ...campaignLeads.map(
        (lead) =>
          `"${lead.name}","${lead.email}","${lead.company}","${lead.position}","${lead.status}","${lead.contactDate}","${lead.lastActivity}",${lead.leadScore}`,
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaign.name}-leads-export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Campaign data exported successfully");
  };

  const statusCounts = campaignLeads.reduce(
    (acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/campaigns")}
          >
            <ArrowLeftIcon size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {campaign.name}
            </h1>
            <p className="text-muted-foreground">
              {campaign.company} • {campaign.location}
            </p>
          </div>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCampaignData}>
            <DownloadIcon size={20} className="mr-2" />
            Export CSV
          </Button>
          <Button>
            {campaign.status === "active" ? (
              <>
                <PauseIcon size={20} className="mr-2" />
                Pause Campaign
              </>
            ) : (
              <>
                <PlayIcon size={20} className="mr-2" />
                Resume Campaign
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {campaign.leads}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Leads
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {campaign.applicants}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Applicants
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {campaign.hired}
                  </div>
                  <div className="text-sm text-muted-foreground">Hired</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round((campaign.hired / campaign.applicants) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Conversion
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{campaign.progress}%</span>
                </div>
                <Progress value={campaign.progress} className="h-3" />
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {campaign.lastUpdate}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Description</div>
              <div className="text-sm">
                {campaign.description || "No description available"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="text-sm">{campaign.lastUpdate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Status Distribution
              </div>
              <div className="space-y-2 mt-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex justify-between items-center"
                  >
                    <Badge
                      className={getLeadStatusColor(
                        status as CampaignLead["status"],
                      )}
                      variant="secondary"
                    >
                      {status}
                    </Badge>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Leads */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UsersIcon size={20} />
              Campaign Leads ({campaignLeads.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {campaignLeads.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <h3 className="text-lg font-medium mb-2">
                No leads in this campaign
              </h3>
              <p className="text-muted-foreground">
                Leads will appear here once they are added to the campaign
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaignLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {lead.email}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-sm text-muted-foreground">
                        {lead.position}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Score: </span>
                        <span className="font-medium">{lead.leadScore}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last activity: {lead.lastActivity}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Badge className={getLeadStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
