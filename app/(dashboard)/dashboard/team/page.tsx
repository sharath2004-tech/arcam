'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { FormField } from '@/components/ui/form-field';
import { Plus, Trash2, Edit, Mail, CheckCircle, Clock } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'photographer' | 'assistant';
  status: 'active' | 'pending';
  joinedAt: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'You',
      email: 'studio@example.com',
      role: 'admin',
      status: 'active',
      joinedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Photographer',
      email: 'sarah@example.com',
      role: 'photographer',
      status: 'active',
      joinedAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'John Assistant',
      email: 'john@example.com',
      role: 'assistant',
      status: 'pending',
      joinedAt: '2024-06-10',
    },
  ]);

  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      const newMember: TeamMember = {
        id: (team.length + 1).toString(),
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: 'photographer',
        status: 'pending',
        joinedAt: new Date().toISOString().split('T')[0],
      };
      setTeam([...team, newMember]);
      setNewMemberEmail('');
    }
  };

  const handleRemove = (id: string) => {
    setTeam(team.filter(member => member.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Team Management</h1>
          <p className="text-muted-foreground">Manage your studio team and collaborators</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Team Members</p>
          <p className="text-3xl font-bold">{team.length}</p>
        </div>
      </div>

      {/* Add Member */}
      <div className="card-glass">
        <h3 className="font-bold mb-4">Invite New Team Member</h3>
        <div className="flex gap-2">
          <FormField
            type="email"
            placeholder="Enter email address"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
          <Button
            onClick={handleAddMember}
            className="gap-2"
            disabled={!newMemberEmail.trim()}
          >
            <Plus className="w-5 h-5" />
            Invite
          </Button>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold mb-4">Team Members</h2>
        {team.map((member) => (
          <div key={member.id} className="card-glass flex items-center justify-between group hover:shadow-lg transition-all">
            <div className="flex-1 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                  <span className="px-2 py-1 rounded-full bg-muted text-xs font-semibold capitalize">
                    {member.role}
                  </span>
                  <div className="flex items-center gap-1">
                    {member.status === 'active' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Active
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-yellow-600" />
                        Pending
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Joined {new Date(member.joinedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            {member.id !== '1' && (
              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(member.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Roles Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            role: 'Admin',
            description: 'Full access to studio settings and team management',
            permissions: ['Manage team', 'View analytics', 'Edit studio info', 'Handle billing']
          },
          {
            role: 'Photographer',
            description: 'Can upload photos and manage their portfolio',
            permissions: ['Upload photos', 'Manage portfolio', 'Receive bookings', 'Chat with clients']
          },
          {
            role: 'Assistant',
            description: 'Limited access, can help with administrative tasks',
            permissions: ['View schedule', 'Message clients', 'Upload files', 'Manage tags']
          },
        ].map((roleInfo, idx) => (
          <div key={idx} className="card-glass">
            <h3 className="font-bold text-lg mb-2">{roleInfo.role}</h3>
            <p className="text-sm text-muted-foreground mb-3">{roleInfo.description}</p>
            <ul className="space-y-1 text-sm">
              {roleInfo.permissions.map((perm, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
