"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MailIcon, SearchIcon, ShieldIcon, UserIcon } from "lucide-react";
import { PlusIcon } from "@phosphor-icons/react";

type Page =
  | "dashboard"
  | "campaigns"
  | "leads"
  | "users"
  | "create-role"
  | "campaign-show";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  avatar?: string;
  department: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export default function UsersList() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Oleh Tsyba",
      email: "oleh@leadmanager.com",
      role: "Admin",
      status: "active",
      lastLogin: "2025-01-16 14:30",
      department: "Management",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@leadmanager.com",
      role: "Lead Generator",
      status: "active",
      lastLogin: "2025-01-16 12:15",
      department: "Sales",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@leadmanager.com",
      role: "Appointment Setter",
      status: "active",
      lastLogin: "2025-01-16 09:45",
      department: "Sales",
    },
    {
      id: "4",
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@leadmanager.com",
      role: "Lead Generator",
      status: "pending",
      lastLogin: "Never",
      department: "Sales",
    },
  ]);
  const [roles] = useState<Role[]>([
    {
      id: "1",
      name: "Admin",
      description: "Full system access with all permissions",
      permissions: [
        "View new contacts",
        "Edit new contacts",
        "View users",
        "Edit users",
        "View user roles",
        "Edit user roles",
        "View API settings",
        "Edit API settings",
        "View statistics",
      ],
      userCount: 1,
    },
    {
      id: "2",
      name: "Lead Generator",
      description: "Can manage leads and create campaigns",
      permissions: [
        "View new contacts",
        "Edit new contacts",
        "View statistics",
      ],
      userCount: 2,
    },
    {
      id: "3",
      name: "Appointment Setter",
      description: "Can manage appointments and contact leads",
      permissions: [
        "View new contacts",
        "Edit new contacts",
        "View statistics",
      ],
      userCount: 1,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const addNewUser = () => {
    if (!newUserEmail || !selectedRole) {
      toast.error("Please provide email and select a role");
      return;
    }

    const emailName = newUserEmail.split("@")[0];
    const name = emailName
      ? emailName.replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : `${emailName}`;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email: newUserEmail,
      role: selectedRole,
      status: "pending",
      lastLogin: "Never",
      department: "Sales",
    };

    setUsers([...users, newUser]);
    setNewUserEmail("");
    setSelectedRole("");
    toast.success("User invitation sent successfully");
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "inactive" : "active";
          return { ...user, status: newStatus };
        }
        return user;
      }),
    );
    toast.success("User status updated");
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    toast.success("User removed successfully");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users & Roles</h1>
          <p className="text-muted-foreground">
            Manage team members and their permissions
          </p>
        </div>
        <Button onClick={() => router.push("/users/create-role")}>
          <ShieldIcon size={20} className="mr-2" />
          Create Role
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="roles">Roles ({roles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Add New User */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invite New User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter email address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={addNewUser}>
                  <PlusIcon size={20} className="mr-2" />
                  Invite User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Users */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <SearchIcon
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <UserIcon
                    size={48}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MailIcon size={14} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {user.role}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {user.department}
                            </div>
                          </div>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              Last login:
                            </div>
                            <div className="text-xs">{user.lastLogin}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeUser(user.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          {/* Roles List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge variant="secondary">{role.userCount} users</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Permissions:</div>
                    <div className="space-y-1">
                      {role.permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {permission}
                        </div>
                      ))}
                    </div>
                    <div className="pt-3">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Role
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
