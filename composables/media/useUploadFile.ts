import { ref } from 'vue';
import { media_api } from '@/api_factory/modules/media';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useUploadFile = () => {
  const loading = ref(false);
  const uploadedUrl = ref<string | null>(null);
  const error = ref<string | null>(null);
  const { showToast } = useCustomToast();

  const uploadFile = async (file: File, folder?: string) => {
    loading.value = true;
    error.value = null;

    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    try {
      const res = await media_api.uploadFile(formData) as any;

      if ([200, 201].includes(res?.status)) {
        uploadedUrl.value = res.data?.secure_url ?? res.data;
        return uploadedUrl.value;
      }

      return res;
    } catch (err: any) {
      error.value = 'Upload failed. Please try again.';
      showToast({
        title: 'Error',
        message: err?.message || 'Upload failed. Please try again.',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, uploadedUrl, error, uploadFile };
};
