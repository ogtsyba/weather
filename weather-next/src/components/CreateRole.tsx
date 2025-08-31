"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeftIcon, PlusIcon } from "@phosphor-icons/react";
import { ShieldIcon } from "lucide-react";

type Page =
  | "dashboard"
  | "campaigns"
  | "leads"
  | "users"
  | "create-role"
  | "campaign-show";



interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const availablePermissions = [
  "View new contacts",
  "Edit new contacts",
  "View users",
  "Edit users",
  "View user roles",
  "Edit user roles",
  "View API settings",
  "Edit API settings",
  "View statistics",
];

export default function CreateRole() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);

  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const selectAllPermissions = () => {
    setSelectedPermissions(
      selectedPermissions.length === availablePermissions.length
        ? []
        : [...availablePermissions],
    );
  };

  const createRole = () => {
    if (!roleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    if (!roleDescription.trim()) {
      toast.error("Please enter a role description");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    // Check if role name already exists
    if (
      roles.some((role) => role.name.toLowerCase() === roleName.toLowerCase())
    ) {
      toast.error("A role with this name already exists");
      return;
    }

    const newRole: Role = {
      id: Date.now().toString(),
      name: roleName.trim(),
      description: roleDescription.trim(),
      permissions: [...selectedPermissions],
      userCount: 0,
    };

    setRoles([...roles, newRole]);
    toast.success("Role created successfully");

    // Reset form
    setRoleName("");
    setRoleDescription("");
    setSelectedPermissions([]);

    // Navigate back to users page
    router.push("/users");
  };

  const resetForm = () => {
    setRoleName("");
    setRoleDescription("");
    setSelectedPermissions([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/users")}>
          <ArrowLeftIcon size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create New Role
          </h1>
          <p className="text-muted-foreground">
            Define permissions and access levels for team members
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon size={20} />
                Role Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Role Name *
                </label>
                <Input
                  placeholder="Enter role name (e.g., Content Manager, Sales Rep)"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe what this role does and its responsibilities..."
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Permissions</CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectedPermissions.length === availablePermissions.length
                    }
                    onCheckedChange={selectAllPermissions}
                  />
                  <span className="text-sm text-muted-foreground">
                    Select All
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedPermissions.includes(permission)}
                      onCheckedChange={() => togglePermission(permission)}
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground cursor-pointer">
                        {permission}
                      </label>
                      <div className="text-xs text-muted-foreground">
                        {getPermissionDescription(permission)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={createRole} className="flex-1">
              <PlusIcon size={20} className="mr-2" />
              Create Role
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
          </div>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Role Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Role Name</div>
                <div className="font-medium">
                  {roleName || "Enter role name..."}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">
                  {roleDescription || "Enter role description..."}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Permissions ({selectedPermissions.length})
                </div>
                {selectedPermissions.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">
                    No permissions selected
                  </div>
                ) : (
                  <div className="space-y-1">
                    {selectedPermissions.map((permission) => (
                      <div
                        key={permission}
                        className="text-sm flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {permission}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    "View new contacts": "Can see lead information and contact details",
    "Edit new contacts": "Can modify lead data and contact information",
    "View users": "Can see team members and their basic information",
    "Edit users": "Can add, remove, and modify user accounts",
    "View user roles": "Can see role definitions and permissions",
    "Edit user roles": "Can create and modify role permissions",
    "View API settings": "Can see API configuration and integration settings",
    "Edit API settings": "Can modify API keys and integration configurations",
    "View statistics": "Can access campaign metrics and performance data",
  };

  return descriptions[permission] || "Permission description not available";
}
