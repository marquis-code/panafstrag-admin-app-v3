import { enquiryApiFactory } from "@/api_factory/modules/enquiry";

export const useEnquiry = () => {
  const enquiries = ref([]);
  const loading = ref(false);

  const fetchEnquiries = async () => {
    loading.value = true;
    try {
      const response = await enquiryApiFactory.getAll();
      enquiries.value = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      await enquiryApiFactory.updateStatus(id, { status });
      await fetchEnquiries();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      await enquiryApiFactory.delete(id);
      await fetchEnquiries();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    enquiries,
    loading,
    fetchEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
  };
};
