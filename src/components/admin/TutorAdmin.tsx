
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash, Video, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReplicaConfig {
  id: string;
  name: string;
  category: string;
  tavusReplicaId: string;
  status: 'active' | 'inactive';
  description: string;
  specialties: string[];
  personality: string;
  greeting: string;
}

const TutorAdmin: React.FC = () => {
  const { toast } = useToast();
  const [replicas, setReplicas] = useState<ReplicaConfig[]>([
    {
      id: 'code-master',
      name: 'Code Master',
      category: 'programming',
      tavusReplicaId: 'replica_programming_001',
      status: 'active',
      description: 'Expert programming instructor',
      specialties: ['JavaScript', 'Python', 'React'],
      personality: 'Patient and methodical',
      greeting: 'Hello! Ready to code?'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingReplica, setEditingReplica] = useState<ReplicaConfig | null>(null);
  const [formData, setFormData] = useState<Partial<ReplicaConfig>>({});

  const handleCreateReplica = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      category: '',
      tavusReplicaId: '',
      status: 'active',
      description: '',
      specialties: [],
      personality: '',
      greeting: ''
    });
  };

  const handleEditReplica = (replica: ReplicaConfig) => {
    setEditingReplica(replica);
    setFormData(replica);
  };

  const handleSaveReplica = () => {
    if (!formData.name || !formData.tavusReplicaId) {
      toast({
        title: "Validation Error",
        description: "Name and Tavus Replica ID are required",
        variant: "destructive",
      });
      return;
    }

    if (editingReplica) {
      // Update existing replica
      setReplicas(prev => prev.map(r => 
        r.id === editingReplica.id ? { ...formData as ReplicaConfig } : r
      ));
      toast({
        title: "Replica Updated",
        description: "AI tutor replica has been updated successfully",
      });
    } else {
      // Create new replica
      const newReplica: ReplicaConfig = {
        ...formData as ReplicaConfig,
        id: formData.name?.toLowerCase().replace(/\s+/g, '-') || ''
      };
      setReplicas(prev => [...prev, newReplica]);
      toast({
        title: "Replica Created",
        description: "New AI tutor replica has been created successfully",
      });
    }

    setIsCreating(false);
    setEditingReplica(null);
    setFormData({});
  };

  const handleDeleteReplica = (replicaId: string) => {
    setReplicas(prev => prev.filter(r => r.id !== replicaId));
    toast({
      title: "Replica Deleted",
      description: "AI tutor replica has been removed",
    });
  };

  const handleSpecialtyChange = (specialties: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: specialties.split(',').map(s => s.trim()).filter(Boolean)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">AI Tutor Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure and manage AI tutor replicas and personas
          </p>
        </div>
        <Button onClick={handleCreateReplica} className="bg-primary-500 hover:bg-primary-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New Replica
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-2xl font-bold">{replicas.length}</p>
                <p className="text-sm text-gray-600">Total Replicas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-secondary-500" />
              <div>
                <p className="text-2xl font-bold">{replicas.filter(r => r.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Active Replicas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-accent-500 rounded"></div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-gray-600">Sessions Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingReplica) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReplica ? 'Edit AI Tutor Replica' : 'Create New AI Tutor Replica'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Replica Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Code Master"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="cooking">Cooking</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tavusReplicaId">Tavus Replica ID</Label>
                <Input
                  id="tavusReplicaId"
                  value={formData.tavusReplicaId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, tavusReplicaId: e.target.value }))}
                  placeholder="replica_xxx_001"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || 'active'} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the AI tutor's expertise"
              />
            </div>

            <div>
              <Label htmlFor="specialties">Specialties (comma-separated)</Label>
              <Input
                id="specialties"
                value={formData.specialties?.join(', ') || ''}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                placeholder="JavaScript, Python, React, Node.js"
              />
            </div>

            <div>
              <Label htmlFor="personality">Personality</Label>
              <Input
                id="personality"
                value={formData.personality || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                placeholder="e.g., Patient, methodical, and encouraging"
              />
            </div>

            <div>
              <Label htmlFor="greeting">Greeting Message</Label>
              <Input
                id="greeting"
                value={formData.greeting || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
                placeholder="e.g., Hello! I'm Code Master, ready to help you learn programming?"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSaveReplica} className="bg-primary-500 hover:bg-primary-600">
                {editingReplica ? 'Update Replica' : 'Create Replica'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setEditingReplica(null);
                  setFormData({});
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Replicas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {replicas.map((replica) => (
          <Card key={replica.id} className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{replica.name}</CardTitle>
                <Badge variant={replica.status === 'active' ? 'default' : 'secondary'}>
                  {replica.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {replica.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Category:</p>
                  <Badge variant="outline">{replica.category}</Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Specialties:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {replica.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {replica.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{replica.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Replica ID:</p>
                  <p className="text-xs text-gray-500 font-mono">{replica.tavusReplicaId}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditReplica(replica)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteReplica(replica.id)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TutorAdmin;
