import { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronUp, User } from 'lucide-react';

export interface TeamMember {
  name: string;
  role: string;
  avatarUrl?: string;
}

interface TeamMemberEditorProps {
  initialTeam: TeamMember[];
  onChange: (team: TeamMember[]) => void;
}

const QUICK_ROLES = ['Founder', 'Co-Founder', 'CEO', 'CTO', 'Developer', 'Designer', 'Marketing', 'Community Manager'];

export function TeamMemberEditor({ initialTeam, onChange }: TeamMemberEditorProps) {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [newMember, setNewMember] = useState<TeamMember>({ name: '', role: '', avatarUrl: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Update team when initialTeam changes
  useEffect(() => {
    if (initialTeam && initialTeam.length > 0) {
      setTeam(initialTeam);
    }
  }, [initialTeam]);

  const handleUpdate = (updatedTeam: TeamMember[]) => {
    setTeam(updatedTeam);
    onChange(updatedTeam);
  };

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim()) {
      return;
    }
    
    const updated = [...team, newMember];
    handleUpdate(updated);
    setNewMember({ name: '', role: '', avatarUrl: '' });
    setShowAddForm(false);
  };

  const handleEditMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = team.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    handleUpdate(updated);
  };

  const handleRemoveMember = (index: number) => {
    const updated = team.filter((_, i) => i !== index);
    handleUpdate(updated);
    setExpandedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-neutral-300">Team Members</label>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-1.5 bg-lime-primary text-black rounded-lg hover:bg-lime-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Add New Member Form */}
      {showAddForm && (
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <h3 className="text-sm font-medium text-neutral-300">New Team Member</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Name *</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-lime-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Role *</label>
              <input
                type="text"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                placeholder="Enter custom role or select below"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-lime-primary"
              />
              
              {/* Quick Role Selection */}
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setNewMember({ ...newMember, role })}
                    className="px-2 py-1 text-xs bg-neutral-800 hover:bg-lime-primary hover:text-black text-neutral-300 rounded-md transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Avatar URL (optional)</label>
              <input
                type="url"
                value={newMember.avatarUrl}
                onChange={(e) => setNewMember({ ...newMember, avatarUrl: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-lime-primary"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddMember}
              disabled={!newMember.name.trim() || !newMember.role.trim()}
              className="flex-1 px-4 py-2 bg-lime-primary text-black rounded-lg hover:bg-lime-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Add Member
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewMember({ name: '', role: '', avatarUrl: '' });
              }}
              className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing Team Members */}
      <div className="space-y-2">
        {team.length === 0 ? (
          <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
            <User className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
            <p className="text-neutral-500">No team members added yet</p>
            <p className="text-xs text-neutral-600 mt-1">Click "Add Member" to get started</p>
          </div>
        ) : (
          team.map((member, index) => (
            <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              {/* Member Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-white">{member.name}</h4>
                    <p className="text-sm text-neutral-400">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMember(index);
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Edit Form (Expanded) */}
              {expandedIndex === index && (
                <div className="p-4 border-t border-neutral-800 space-y-3 bg-neutral-900/50">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleEditMember(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-lime-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Role</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleEditMember(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-lime-primary"
                    />
                    
                    {/* Quick Role Selection */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {QUICK_ROLES.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleEditMember(index, 'role', role)}
                          className="px-2 py-1 text-xs bg-neutral-800 hover:bg-lime-primary hover:text-black text-neutral-300 rounded-md transition-colors"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Avatar URL</label>
                    <input
                      type="url"
                      value={member.avatarUrl || ''}
                      onChange={(e) => handleEditMember(index, 'avatarUrl', e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-lime-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {team.length > 0 && (
        <p className="text-xs text-neutral-500">
          {team.length} team member{team.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}
