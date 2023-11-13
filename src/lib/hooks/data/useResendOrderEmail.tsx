import { useMutation } from '@tanstack/react-query';

import { resendOrderEmail, ResendOrderEmailParams } from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

export function useResendOrderEmail() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (params: ResendOrderEmailParams) => resendOrderEmail(params),
    onSuccess: (data) => {
      if (data.status === 'ok') {
        toast({
          description: 'Email ze szczegółami zlecenia został wysłany ponownie',
          variant: 'success',
        });
      }
    },
  });
}
