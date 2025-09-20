import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Shield, ShieldCheck, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  joined_at: string;
  grade?: number;
  target_exam?: string;
  role?: 'user' | 'admin' | 'super_admin';
}

// Mock users data
const mockUsers: UserProfile[] = [
  {
    id: '1',
    user_id: 'user1',
    email: 'student1@example.com',
    full_name: 'Rahul Sharma',
    joined_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    grade: 12,
    target_exam: 'JEE Main',
    role: 'user'
  },
  {
    id: '2',
    user_id: 'user2',
    email: 'student2@example.com',
    full_name: 'Priya Patel',
    joined_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    grade: 11,
    target_exam: 'JEE Advanced',
    role: 'user'
  },
  {
    id: '3',
    user_id: 'admin1',
    email: 'admin@example.com',
    full_name: 'Admin User',
    joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    target_exam: 'N/A',
    role: 'admin'
  }
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load users from localStorage or use mock data
      const storedUsers = localStorage.getItem('mockUserManagement');
      const usersData = storedUsers ? JSON.parse(storedUsers) : mockUsers;
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
    try {
      // Update local state
      const updatedUsers = users.map(user => 
        user.user_id === userId ? { ...user, role: newRole } : user
      );
      
      setUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem('mockUserManagement', JSON.stringify(updatedUsers));

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users and their roles. Total users: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="super_admin">Super Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Target Exam</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="font-medium">
                            {user.full_name || 'No name'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.target_exam || 'Not set'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.grade || 'Not set'}</TableCell>
                      <TableCell>
                        {new Date(user.joined_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role || 'user'}
                          onValueChange={(value) => updateUserRole(user.user_id, value as any)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};