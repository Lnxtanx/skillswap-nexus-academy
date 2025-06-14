
import { Button } from '@/components/ui/button';
import { useEnrollment, useEnrollInCourse } from '@/hooks/useEnrollments';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import { Loader2, CheckCircle } from 'lucide-react';

interface EnrollButtonProps {
  courseId: number;
  price?: number;
}

export default function EnrollButton({ courseId, price = 0 }: EnrollButtonProps) {
  const { user } = useAuth();
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(courseId);
  const enrollMutation = useEnrollInCourse();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleEnroll = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    enrollMutation.mutate(courseId);
  };

  if (enrollmentLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (enrollment) {
    return (
      <Button disabled className="bg-green-600 hover:bg-green-600">
        <CheckCircle className="mr-2 h-4 w-4" />
        Enrolled
      </Button>
    );
  }

  return (
    <>
      <Button 
        onClick={handleEnroll} 
        disabled={enrollMutation.isPending}
        className="w-full"
      >
        {enrollMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {price > 0 ? `Enroll for $${price}` : 'Enroll for Free'}
      </Button>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
